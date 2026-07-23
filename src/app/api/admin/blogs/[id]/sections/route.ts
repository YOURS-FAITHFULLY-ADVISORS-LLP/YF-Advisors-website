import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { blogSectionSchema } from '@/src/validations/blog.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const POST = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: blogId } = await params;

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { id: true, slug: true },
  });

  if (!blog) {
    return apiError('Blog not found', ['Cannot add section to non-existing blog'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = blogSectionSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const section = await prisma.blogSection.create({
    data: {
      blogId,
      heading: data.heading || null,
      content: data.content,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  revalidateCmsPaths(['/blog', `/blog/${blog.slug}`]);

  return apiSuccess(section, 'Blog section added successfully', undefined, 201);
});
