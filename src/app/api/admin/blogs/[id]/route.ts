import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateBlogSchema } from '@/src/validations/blog.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const GET = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      sections: { orderBy: { displayOrder: 'asc' } },
    },
  });

  if (!blog) {
    return apiError('Blog not found', ['No blog found with the specified ID'], 404);
  }

  return apiSuccess(blog, 'Blog retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    return apiError('Blog not found', ['Cannot update non-existing blog'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateBlogSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  // Check unique slug if updating slug
  if (data.slug && data.slug !== existingBlog.slug) {
    const slugTaken = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });
    if (slugTaken) {
      return apiError('Conflict', ['A blog with this slug already exists'], 409);
    }
  }

  const publishedAt =
    data.status === 'PUBLISHED'
      ? existingBlog.publishedAt || new Date()
      : data.status === 'DRAFT'
      ? null
      : existingBlog.publishedAt;

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.cardDescription !== undefined ? { cardDescription: data.cardDescription } : {}),
      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
      ...(data.image !== undefined ? { image: data.image || null } : {}),
      ...(data.category !== undefined ? { category: data.category || null } : {}),
      ...(data.tags !== undefined ? { tags: data.tags || null } : {}),
      ...(data.author !== undefined ? { author: data.author } : {}),
      ...(data.content !== undefined ? { content: data.content || null } : {}),
      ...(data.status !== undefined ? { status: data.status, publishedAt } : {}),
    },
    include: {
      sections: { orderBy: { displayOrder: 'asc' } },
    },
  });

  revalidateCmsPaths(['/blogs', `/blogs/${updatedBlog.slug}`, '/']);

  return apiSuccess(updatedBlog, 'Blog updated successfully', undefined, 200);
});

export const DELETE = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existingBlog) {
    return apiError('Blog not found', ['Cannot delete non-existing blog'], 404);
  }

  await prisma.blog.delete({
    where: { id },
  });

  revalidateCmsPaths(['/blogs', `/blogs/${existingBlog.slug}`, '/']);

  return apiSuccess({ id }, 'Blog deleted successfully', undefined, 200);
});
