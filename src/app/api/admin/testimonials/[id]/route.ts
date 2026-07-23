import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateTestimonialSchema } from '@/src/validations/testimonial.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const GET = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    return apiError('Testimonial not found', ['No testimonial found with the specified ID'], 404);
  }

  return apiSuccess(testimonial, 'Testimonial retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingTestimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingTestimonial) {
    return apiError('Testimonial not found', ['Cannot update non-existing testimonial'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateTestimonialSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const updatedTestimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.designation !== undefined ? { designation: data.designation } : {}),
      ...(data.company !== undefined ? { company: data.company || null } : {}),
      ...(data.profileImage !== undefined ? { profileImage: data.profileImage || null } : {}),
      ...(data.initials !== undefined ? { initials: data.initials || null } : {}),
      ...(data.review !== undefined ? { review: data.review } : {}),
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.isVerified !== undefined ? { isVerified: data.isVerified } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
    },
  });

  revalidateCmsPaths(['/testimonials', '/']);

  return apiSuccess(updatedTestimonial, 'Testimonial updated successfully', undefined, 200);
});

export const DELETE = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingTestimonial = await prisma.testimonial.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingTestimonial) {
    return apiError('Testimonial not found', ['Cannot delete non-existing testimonial'], 404);
  }

  await prisma.testimonial.delete({
    where: { id },
  });

  revalidateCmsPaths(['/testimonials', '/']);

  return apiSuccess({ id }, 'Testimonial deleted successfully', undefined, 200);
});
