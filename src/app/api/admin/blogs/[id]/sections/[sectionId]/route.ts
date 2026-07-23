import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { blogSectionSchema } from '@/src/validations/blog.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string; sectionId: string }> }) => {
  const { id: blogId, sectionId } = await params;

  const section = await prisma.blogSection.findFirst({
    where: { id: sectionId, blogId },
    include: { blog: { select: { slug: true } } },
  });

  if (!section) {
    return apiError('Section not found', ['No section found matching the given IDs'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = blogSectionSchema.partial().safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const updatedSection = await prisma.blogSection.update({
    where: { id: sectionId },
    data: {
      ...(data.heading !== undefined ? { heading: data.heading || null } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
    },
  });

  revalidateCmsPaths(['/blog', `/blog/${section.blog.slug}`]);

  return apiSuccess(updatedSection, 'Blog section updated successfully', undefined, 200);
});

export const DELETE = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string; sectionId: string }> }) => {
  const { id: blogId, sectionId } = await params;

  const section = await prisma.blogSection.findFirst({
    where: { id: sectionId, blogId },
    include: { blog: { select: { slug: true } } },
  });

  if (!section) {
    return apiError('Section not found', ['Cannot delete non-existing blog section'], 404);
  }

  await prisma.blogSection.delete({
    where: { id: sectionId },
  });

  revalidateCmsPaths(['/blog', `/blog/${section.blog.slug}`]);

  return apiSuccess({ id: sectionId }, 'Blog section deleted successfully', undefined, 200);
});
