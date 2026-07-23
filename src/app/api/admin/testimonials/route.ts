import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { buildPaginationMeta, parseQueryParams } from '@/src/lib/pagination';
import { prisma } from '@/src/lib/prisma';
import { createTestimonialSchema } from '@/src/validations/testimonial.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';
type TestimonialStatus = 'DRAFT' | 'PUBLISHED';

export const GET = withApiHandler(async (req: NextRequest) => {
  const { page, limit, skip, search, status, sortBy, sortOrder, isVerified } = parseQueryParams(req);

  const where: any = {};

  if (status && (status === 'DRAFT' || status === 'PUBLISHED')) {
    where.status = status as TestimonialStatus;
  }

  if (isVerified !== undefined) {
    where.isVerified = isVerified;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { designation: { contains: search, mode: 'insensitive' } },
      { review: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (['displayOrder', 'rating', 'name', 'createdAt', 'updatedAt'].includes(sortBy)) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.displayOrder = 'asc';
  }

  const [total, testimonials] = await Promise.all([
    prisma.testimonial.count({ where }),
    prisma.testimonial.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  return apiSuccess(testimonials, 'Testimonials retrieved successfully', meta, 200);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = createTestimonialSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const testimonial = await prisma.testimonial.create({
    data: {
      name: data.name,
      designation: data.designation,
      company: data.company || null,
      profileImage: data.profileImage || null,
      initials: data.initials || null,
      review: data.review,
      rating: data.rating ?? 5,
      isVerified: data.isVerified ?? true,
      status: data.status,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  revalidateCmsPaths(['/testimonials', '/']);

  return apiSuccess(testimonial, 'Testimonial created successfully', undefined, 201);
});
