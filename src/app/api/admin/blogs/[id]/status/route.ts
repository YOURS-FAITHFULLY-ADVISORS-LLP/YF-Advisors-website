import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { statusToggleSchema } from '@/src/validations/common.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
    select: { id: true, slug: true, status: true, publishedAt: true },
  });

  if (!existingBlog) {
    return apiError('Blog not found', ['Cannot update status of non-existing blog'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = statusToggleSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const { status } = validation.data;

  const publishedAt =
    status === 'PUBLISHED'
      ? existingBlog.publishedAt || new Date()
      : null;

  const blog = await prisma.blog.update({
    where: { id },
    data: {
      status,
      publishedAt,
    },
  });

  revalidateCmsPaths(['/blog', `/blog/${blog.slug}`]);

  return apiSuccess(blog, 'Blog status updated successfully', undefined, 200);
});
