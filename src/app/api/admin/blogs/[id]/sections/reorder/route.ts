import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { reorderSectionsSchema } from '@/src/validations/blog.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: blogId } = await params;

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { id: true, slug: true },
  });

  if (!blog) {
    return apiError('Blog not found', ['Cannot reorder sections of non-existing blog'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = reorderSectionsSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const { sections } = validation.data;

  await prisma.$transaction(
    sections.map((sec) =>
      prisma.blogSection.updateMany({
        where: { id: sec.id, blogId },
        data: { displayOrder: sec.displayOrder },
      })
    )
  );

  revalidateCmsPaths(['/blog', `/blog/${blog.slug}`]);

  return apiSuccess(null, 'Blog sections reordered successfully', undefined, 200);
});
