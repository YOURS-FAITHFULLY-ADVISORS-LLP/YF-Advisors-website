import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { buildPaginationMeta, parseQueryParams } from '@/src/lib/pagination';
import { prisma } from '@/src/lib/prisma';
import { createBlogSchema } from '@/src/validations/blog.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';
type BlogStatus = 'DRAFT' | 'PUBLISHED';

export const GET = withApiHandler(async (req: NextRequest) => {
  const { page, limit, skip, search, status, sortBy, sortOrder } = parseQueryParams(req);

  const where: any = {};

  if (status && (status === 'DRAFT' || status === 'PUBLISHED')) {
    where.status = status as BlogStatus;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { cardDescription: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { tags: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (['title', 'createdAt', 'updatedAt', 'publishedAt'].includes(sortBy)) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = 'desc';
  }

  const [total, blogs] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        sections: { orderBy: { displayOrder: 'asc' } },
      },
    }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  return apiSuccess(blogs, 'Blogs retrieved successfully', meta, 200);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = createBlogSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  // Check unique slug
  const existingBlog = await prisma.blog.findUnique({
    where: { slug: data.slug },
  });

  if (existingBlog) {
    return apiError('Conflict', ['A blog with this slug already exists'], 409);
  }

  const publishedAt = data.status === 'PUBLISHED' ? new Date() : null;

  const blog = await prisma.blog.create({
    data: {
      title: data.title,
      slug: data.slug,
      cardDescription: data.cardDescription,
      excerpt: data.excerpt,
      image: data.image || null,
      category: data.category || null,
      tags: data.tags || null,
      author: data.author || 'YF Advisors',
      content: data.content || null,
      status: data.status,
      publishedAt,
      sections: data.sections && data.sections.length > 0 ? {
        create: data.sections.map((s, idx) => ({
          heading: s.heading || null,
          content: s.content || '',
          displayOrder: s.displayOrder ?? idx,
        })),
      } : undefined,
    },
    include: {
      sections: { orderBy: { displayOrder: 'asc' } },
    },
  });

  revalidateCmsPaths(['/blogs', `/blogs/${blog.slug}`, '/']);

  return apiSuccess(blog, 'Blog created successfully', undefined, 201);
});
