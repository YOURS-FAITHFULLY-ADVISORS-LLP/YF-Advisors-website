import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

const verifiedToggleSchema = z.object({
  isVerified: z.boolean(),
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingTestimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingTestimonial) {
    return apiError('Testimonial not found', ['Cannot update verification status of non-existing testimonial'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = verifiedToggleSchema.safeParse(body);
  if (!validation.success) {
    return apiError(
      'Validation error',
      validation.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`),
      422
    );
  }

  const { isVerified } = validation.data;

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: { isVerified },
  });

  revalidateCmsPaths(['/testimonials', '/']);

  return apiSuccess(testimonial, 'Testimonial verification status updated successfully', undefined, 200);
});
