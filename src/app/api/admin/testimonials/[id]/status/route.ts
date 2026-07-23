import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { statusToggleSchema } from '@/src/validations/common.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingTestimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingTestimonial) {
    return apiError('Testimonial not found', ['Cannot update status of non-existing testimonial'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = statusToggleSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const { status } = validation.data;

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: { status },
  });

  revalidateCmsPaths(['/testimonials', '/']);

  return apiSuccess(testimonial, 'Testimonial status updated successfully', undefined, 200);
});
