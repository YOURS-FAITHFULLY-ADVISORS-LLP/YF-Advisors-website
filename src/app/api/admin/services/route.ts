import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { buildPaginationMeta, parseQueryParams } from '@/src/lib/pagination';
import { prisma } from '@/src/lib/prisma';
import { createServiceSchema } from '@/src/validations/service.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { generateUniqueSlug } from '@/src/lib/slug';
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
      { description: { contains: search, mode: 'insensitive' } },
      { keyValue: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (['title', 'createdAt', 'publishedAt', 'updatedAt'].includes(sortBy)) {
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
        relatedServices: {
          include: {
            related: {
              select: { id: true, title: true, slug: true, icon: true },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
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
  const slug = await generateUniqueSlug('service', data.slug || data.title);

  const publishedAt =
    data.status === 'PUBLISHED'
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : null;

  const service = await prisma.$transaction(async (tx) => {
    return tx.service.create({
      data: {
        title: data.title,
        slug,
        icon: data.icon || null,
        image: data.image || null,
        cardDescription: data.cardDescription,
        keyValue: data.keyValue,
        description: data.description,
        status: data.status,
        publishedAt,
        offerings: data.offerings && data.offerings.length > 0
          ? {
              create: data.offerings.map((item, idx) => ({
                title: item.title,
                description: item.description,
                order: item.order ?? idx,
              })),
            }
          : undefined,
        capabilities: data.capabilities && data.capabilities.length > 0
          ? {
              create: data.capabilities.map((item, idx) => ({
                title: item.title,
                description: item.description,
                order: item.order ?? idx,
              })),
            }
          : undefined,
        benefits: data.benefits && data.benefits.length > 0
          ? {
              create: data.benefits.map((item, idx) => ({
                title: item.title,
                description: item.description,
                order: item.order ?? idx,
              })),
            }
          : undefined,
        whyChooseUs: data.whyChooseUs && data.whyChooseUs.length > 0
          ? {
              create: data.whyChooseUs.map((item, idx) => ({
                title: item.title,
                description: item.description,
                order: item.order ?? idx,
              })),
            }
          : undefined,
        workSteps: data.workSteps && data.workSteps.length > 0
          ? {
              create: data.workSteps.map((item, idx) => ({
                stepNumber: item.stepNumber ?? idx + 1,
                title: item.title,
                description: item.description,
              })),
            }
          : undefined,
        relatedServices: data.relatedServices && data.relatedServices.length > 0
          ? {
              create: data.relatedServices.map((item, idx) => ({
                relatedId: item.relatedId,
                displayOrder: item.displayOrder ?? idx,
              })),
            }
          : undefined,
      },
      include: {
        offerings: { orderBy: { order: 'asc' } },
        capabilities: { orderBy: { order: 'asc' } },
        benefits: { orderBy: { order: 'asc' } },
        whyChooseUs: { orderBy: { order: 'asc' } },
        workSteps: { orderBy: { stepNumber: 'asc' } },
        relatedServices: {
          include: {
            related: {
              select: { id: true, title: true, slug: true, icon: true },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  });

  revalidateCmsPaths(['/services', `/services/${service.slug}`]);

  return apiSuccess(service, 'Service created successfully', undefined, 201);
});
