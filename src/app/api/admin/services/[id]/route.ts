import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateServiceSchema } from '@/src/validations/service.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { generateUniqueSlug } from '@/src/lib/slug';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const GET = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
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

  if (!service) {
    return apiError('Service not found', ['No service found with the specified ID'], 404);
  }

  return apiSuccess(service, 'Service retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingService = await prisma.service.findUnique({
    where: { id },
    select: { id: true, slug: true, status: true, publishedAt: true },
  });

  if (!existingService) {
    return apiError('Service not found', ['Cannot update non-existing service record'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateServiceSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;
  let finalSlug = existingService.slug;

  if (data.slug && data.slug !== existingService.slug) {
    finalSlug = await generateUniqueSlug('service', data.slug, id);
  }

  let publishedAt = existingService.publishedAt;
  if (data.status === 'PUBLISHED' && !existingService.publishedAt) {
    publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
  } else if (data.status === 'DRAFT') {
    publishedAt = null;
  } else if (data.publishedAt) {
    publishedAt = new Date(data.publishedAt);
  }

  const service = await prisma.$transaction(async (tx) => {
    // Sync Offerings if provided
    if (data.offerings !== undefined) {
      await tx.serviceOffering.deleteMany({ where: { serviceId: id } });
      if (data.offerings.length > 0) {
        await tx.serviceOffering.createMany({
          data: data.offerings.map((item, idx) => ({
            serviceId: id,
            title: item.title,
            description: item.description,
            order: item.order ?? idx,
          })),
        });
      }
    }

    // Sync Capabilities if provided
    if (data.capabilities !== undefined) {
      await tx.serviceCapability.deleteMany({ where: { serviceId: id } });
      if (data.capabilities.length > 0) {
        await tx.serviceCapability.createMany({
          data: data.capabilities.map((item, idx) => ({
            serviceId: id,
            title: item.title,
            description: item.description,
            order: item.order ?? idx,
          })),
        });
      }
    }

    // Sync Benefits if provided
    if (data.benefits !== undefined) {
      await tx.serviceBenefit.deleteMany({ where: { serviceId: id } });
      if (data.benefits.length > 0) {
        await tx.serviceBenefit.createMany({
          data: data.benefits.map((item, idx) => ({
            serviceId: id,
            title: item.title,
            description: item.description,
            order: item.order ?? idx,
          })),
        });
      }
    }

    // Sync Why Choose Us points if provided
    if (data.whyChooseUs !== undefined) {
      await tx.whyChoosePoint.deleteMany({ where: { serviceId: id } });
      if (data.whyChooseUs.length > 0) {
        await tx.whyChoosePoint.createMany({
          data: data.whyChooseUs.map((item, idx) => ({
            serviceId: id,
            title: item.title,
            description: item.description,
            order: item.order ?? idx,
          })),
        });
      }
    }

    // Sync Work Steps if provided
    if (data.workSteps !== undefined) {
      await tx.workStep.deleteMany({ where: { serviceId: id } });
      if (data.workSteps.length > 0) {
        await tx.workStep.createMany({
          data: data.workSteps.map((item, idx) => ({
            serviceId: id,
            stepNumber: item.stepNumber ?? idx + 1,
            title: item.title,
            description: item.description,
          })),
        });
      }
    }

    // Sync Related Services if provided
    if (data.relatedServices !== undefined) {
      await tx.relatedService.deleteMany({ where: { serviceId: id } });
      if (data.relatedServices.length > 0) {
        await tx.relatedService.createMany({
          data: data.relatedServices.map((item, idx) => ({
            serviceId: id,
            relatedId: item.relatedId,
            displayOrder: item.displayOrder ?? idx,
          })),
        });
      }
    }

    return tx.service.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        slug: finalSlug,
        ...(data.icon !== undefined ? { icon: data.icon || null } : {}),
        ...(data.image !== undefined ? { image: data.image || null } : {}),
        ...(data.cardDescription !== undefined ? { cardDescription: data.cardDescription } : {}),
        ...(data.keyValue !== undefined ? { keyValue: data.keyValue } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        publishedAt,
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

  return apiSuccess(service, 'Service updated successfully', undefined, 200);
});

export const DELETE = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingService = await prisma.service.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existingService) {
    return apiError('Service not found', ['Cannot delete non-existing service record'], 404);
  }

  await prisma.service.delete({
    where: { id },
  });

  revalidateCmsPaths(['/services', `/services/${existingService.slug}`]);

  return apiSuccess({ id }, 'Service deleted successfully', undefined, 200);
});
