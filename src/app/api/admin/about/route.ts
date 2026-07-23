import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateAboutSchema } from '@/src/validations/about.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

async function getOrCreateAboutRecord() {
  let about = await prisma.about.findFirst({
    include: {
      visionPoints: { orderBy: { order: 'asc' } },
      missionPoints: { orderBy: { order: 'asc' } },
      statistics: { orderBy: { order: 'asc' } },
    },
  });

  if (!about) {
    about = await prisma.about.create({
      data: {
        title: 'About YF Advisors',
        subtitle: 'Empowering Businesses with Strategic Financial Advisory',
        whoWeAreTitle: 'Who We Are',
        whoWeAreContent: 'YF Advisors is a premier financial advisory firm.',
        whyChooseTitle: 'Why Choose Us',
        whyChooseContent: 'Proven expertise across corporate advisory and compliance.',
      },
      include: {
        visionPoints: { orderBy: { order: 'asc' } },
        missionPoints: { orderBy: { order: 'asc' } },
        statistics: { orderBy: { order: 'asc' } },
      },
    });
  }

  return about;
}

export const GET = withApiHandler(async () => {
  const about = await getOrCreateAboutRecord();
  return apiSuccess(about, 'About details retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  const currentRecord = await getOrCreateAboutRecord();

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateAboutSchema.partial().safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const updatedAbout = await prisma.$transaction(async (tx: any) => {
    // Sync Vision Points if provided
    if (data.visionPoints !== undefined) {
      await tx.visionPoint.deleteMany({ where: { aboutId: currentRecord.id } });
      if (data.visionPoints.length > 0) {
        await tx.visionPoint.createMany({
          data: data.visionPoints.map((v, idx) => ({
            aboutId: currentRecord.id,
            title: v.title,
            order: v.order ?? idx,
          })),
        });
      }
    }

    // Sync Mission Points if provided
    if (data.missionPoints !== undefined) {
      await tx.missionPoint.deleteMany({ where: { aboutId: currentRecord.id } });
      if (data.missionPoints.length > 0) {
        await tx.missionPoint.createMany({
          data: data.missionPoints.map((m, idx) => ({
            aboutId: currentRecord.id,
            title: m.title,
            order: m.order ?? idx,
          })),
        });
      }
    }

    // Sync Statistics if provided
    if (data.statistics !== undefined) {
      await tx.aboutStatistic.deleteMany({ where: { aboutId: currentRecord.id } });
      if (data.statistics.length > 0) {
        await tx.aboutStatistic.createMany({
          data: data.statistics.map((s, idx) => ({
            aboutId: currentRecord.id,
            title: s.title,
            value: s.value,
            icon: s.icon || null,
            order: s.order ?? idx,
          })),
        });
      }
    }

    return tx.about.update({
      where: { id: currentRecord.id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.subtitle !== undefined ? { subtitle: data.subtitle } : {}),
        ...(data.whoWeAreTitle !== undefined ? { whoWeAreTitle: data.whoWeAreTitle } : {}),
        ...(data.whoWeAreContent !== undefined ? { whoWeAreContent: data.whoWeAreContent } : {}),
        ...(data.whyChooseTitle !== undefined ? { whyChooseTitle: data.whyChooseTitle } : {}),
        ...(data.whyChooseContent !== undefined ? { whyChooseContent: data.whyChooseContent } : {}),
      },
      include: {
        visionPoints: { orderBy: { order: 'asc' } },
        missionPoints: { orderBy: { order: 'asc' } },
        statistics: { orderBy: { order: 'asc' } },
      },
    });
  });

  revalidateCmsPaths(['/about', '/']);

  return apiSuccess(updatedAbout, 'About content updated successfully', undefined, 200);
});
