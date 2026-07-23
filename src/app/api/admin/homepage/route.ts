import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateHomepageSchema } from '@/src/validations/homepage.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

async function getOrCreateHomepageRecord() {
  let homepage = await prisma.homepage.findFirst();

  if (!homepage) {
    homepage = await prisma.homepage.create({
      data: {
        heroTitle: 'Welcome to YF Advisors',
        heroDescription: 'Your trusted partner for financial planning and advisory services.',
        heroButtonText: 'Explore Services',
        heroButtonLink: '/services',
      },
    });
  }

  return homepage;
}

export const GET = withApiHandler(async () => {
  const homepage = await getOrCreateHomepageRecord();
  return apiSuccess(homepage, 'Homepage details retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  const currentRecord = await getOrCreateHomepageRecord();

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateHomepageSchema.partial().safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const updatedHomepage = await prisma.homepage.update({
    where: { id: currentRecord.id },
    data: {
      ...(data.heroTitle !== undefined ? { heroTitle: data.heroTitle } : {}),
      ...(data.heroDescription !== undefined ? { heroDescription: data.heroDescription } : {}),
      ...(data.heroImage !== undefined ? { heroImage: data.heroImage || null } : {}),
      ...(data.heroButtonText !== undefined ? { heroButtonText: data.heroButtonText || null } : {}),
      ...(data.heroButtonLink !== undefined ? { heroButtonLink: data.heroButtonLink || null } : {}),
    },
  });

  revalidateCmsPaths(['/']);

  return apiSuccess(updatedHomepage, 'Homepage content updated successfully', undefined, 200);
});
