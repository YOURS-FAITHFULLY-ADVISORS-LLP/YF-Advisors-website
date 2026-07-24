import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateServiceSchema } from '@/src/validations/service.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
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
  });

  if (!existingService) {
    return apiError('Service not found', ['Cannot update non-existing service'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateServiceSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  // Check unique slug if updating slug
  if (data.slug && data.slug !== existingService.slug) {
    const slugTaken = await prisma.service.findUnique({
      where: { slug: data.slug },
    });
    if (slugTaken) {
      return apiError('Conflict', ['A service with this slug already exists'], 409);
    }
  }

  const publishedAt =
    data.status === 'PUBLISHED'
      ? existingService.publishedAt || new Date()
      : data.status === 'DRAFT'
      ? null
      : existingService.publishedAt;

  await prisma.$transaction(async (tx) => {
    // 1. Update main Service attributes
    await tx.service.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.icon !== undefined ? { icon: data.icon || null } : {}),
        ...(data.image !== undefined ? { image: data.image || null } : {}),
        ...(data.cardDescription !== undefined ? { cardDescription: data.cardDescription } : {}),
        ...(data.keyValue !== undefined ? { keyValue: data.keyValue } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.status !== undefined ? { status: data.status, publishedAt } : {}),
      },
    });

    // 2. Update Offerings
    if (data.offerings !== undefined) {
      await tx.serviceOffering.deleteMany({ where: { serviceId: id } });
      if (data.offerings.length > 0) {
        await tx.serviceOffering.createMany({
          data: data.offerings.map((o, idx) => ({
            serviceId: id,
            title: o.title,
            description: o.description || '',
            order: o.order ?? idx,
          })),
        });
      }
    }

    // 3. Update Capabilities
    if (data.capabilities !== undefined) {
      await tx.serviceCapability.deleteMany({ where: { serviceId: id } });
      if (data.capabilities.length > 0) {
        await tx.serviceCapability.createMany({
          data: data.capabilities.map((c, idx) => ({
            serviceId: id,
            title: c.title,
            description: c.description || '',
            order: c.order ?? idx,
          })),
        });
      }
    }

    // 4. Update Benefits
    if (data.benefits !== undefined) {
      await tx.serviceBenefit.deleteMany({ where: { serviceId: id } });
      if (data.benefits.length > 0) {
        await tx.serviceBenefit.createMany({
          data: data.benefits.map((b, idx) => ({
            serviceId: id,
            title: b.title,
            description: b.description || '',
            order: b.order ?? idx,
          })),
        });
      }
    }

    // 5. Update WhyChooseUs (WhyChoosePoint)
    if (data.whyChooseUs !== undefined) {
      await tx.whyChoosePoint.deleteMany({ where: { serviceId: id } });
      if (data.whyChooseUs.length > 0) {
        await tx.whyChoosePoint.createMany({
          data: data.whyChooseUs.map((w, idx) => ({
            serviceId: id,
            title: w.title,
            description: w.description || '',
            order: w.order ?? idx,
          })),
        });
      }
    }

    // 6. Update WorkSteps (WorkStep)
    if (data.workSteps !== undefined) {
      await tx.workStep.deleteMany({ where: { serviceId: id } });
      if (data.workSteps.length > 0) {
        await tx.workStep.createMany({
          data: data.workSteps.map((s, idx) => ({
            serviceId: id,
            title: s.title,
            description: s.description || '',
            stepNumber: s.stepNumber ?? (idx + 1),
          })),
        });
      }
    }
  });

  const updatedService = await prisma.service.findUnique({
    where: { id },
    include: {
      offerings: { orderBy: { order: 'asc' } },
      capabilities: { orderBy: { order: 'asc' } },
      benefits: { orderBy: { order: 'asc' } },
      whyChooseUs: { orderBy: { order: 'asc' } },
      workSteps: { orderBy: { stepNumber: 'asc' } },
    },
  });

  if (updatedService) {
    revalidateCmsPaths(['/services', `/services/${updatedService.slug}`, '/']);
  }

  return apiSuccess(updatedService, 'Service updated successfully', undefined, 200);
});

export const DELETE = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingService = await prisma.service.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existingService) {
    return apiError('Service not found', ['Cannot delete non-existing service'], 404);
  }

  await prisma.service.delete({
    where: { id },
  });

  revalidateCmsPaths(['/services', `/services/${existingService.slug}`, '/']);

  return apiSuccess(null, 'Service deleted successfully', undefined, 200);
});
