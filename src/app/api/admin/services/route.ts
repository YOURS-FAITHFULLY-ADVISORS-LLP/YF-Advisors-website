import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { buildPaginationMeta, parseQueryParams } from '@/src/lib/pagination';
import { prisma } from '@/src/lib/prisma';
import { createServiceSchema } from '@/src/validations/service.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';
import { ServiceStatus } from '@prisma/client';

export const GET = withApiHandler(async (req: NextRequest) => {
  const { page, limit, skip, search, status, sortBy, sortOrder } = parseQueryParams(req);

  const where: any = {};

  if (status && (status === 'DRAFT' || status === 'PUBLISHED')) {
    where.status = status as ServiceStatus;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { cardDescription: { contains: search, mode: 'insensitive' } },
      { keyValue: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (['title', 'createdAt', 'updatedAt', 'publishedAt'].includes(sortBy)) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = 'desc';
  }

  const [total, services] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        offerings: { orderBy: { order: 'asc' } },
        capabilities: { orderBy: { order: 'asc' } },
        benefits: { orderBy: { order: 'asc' } },
        whyChooseUs: { orderBy: { order: 'asc' } },
        workSteps: { orderBy: { stepNumber: 'asc' } },
      },
    }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  return apiSuccess(services, 'Services retrieved successfully', meta, 200);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = createServiceSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  // Check unique slug
  const existingService = await prisma.service.findUnique({
    where: { slug: data.slug },
  });

  if (existingService) {
    return apiError('Conflict', ['A service with this slug already exists'], 409);
  }

  const publishedAt = data.status === 'PUBLISHED' ? new Date() : null;

  const service = await prisma.service.create({
    data: {
      title: data.title,
      slug: data.slug,
      icon: data.icon || null,
      image: data.image || null,
      cardDescription: data.cardDescription,
      keyValue: data.keyValue,
      description: data.description,
      status: data.status,
      publishedAt,
    },
    include: {
      offerings: true,
      capabilities: true,
      benefits: true,
      whyChooseUs: true,
      workSteps: true,
    },
  });

  revalidateCmsPaths(['/services', `/services/${service.slug}`, '/']);

  return apiSuccess(service, 'Service created successfully', undefined, 201);
});
