import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateSettingsSchema } from '@/src/validations/settings.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

async function getOrCreateSettingsRecord() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        companyName: 'YF Advisors LLP',
        companyEmail: 'info@yfadvisors.in',
        companyPhone: '+91 99999 99999',
        companyAddress: 'YF Advisors Office, New Delhi, India',
        defaultMetaTitle: 'YF Advisors - Premier Financial Advisory Services',
        defaultMetaDescription: 'Strategic financial advisory, compliance, tax, and process re-engineering.',
        officeHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
      },
    });
  }

  return settings;
}

export const GET = withApiHandler(async () => {
  const settings = await getOrCreateSettingsRecord();
  return apiSuccess(settings, 'Global settings retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  const currentRecord = await getOrCreateSettingsRecord();

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateSettingsSchema.partial().safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const updatedSettings = await prisma.settings.update({
    where: { id: currentRecord.id },
    data: {
      ...(data.companyName !== undefined ? { companyName: data.companyName } : {}),
      ...(data.companyEmail !== undefined ? { companyEmail: data.companyEmail || null } : {}),
      ...(data.companyPhone !== undefined ? { companyPhone: data.companyPhone || null } : {}),
      ...(data.companyAddress !== undefined ? { companyAddress: data.companyAddress || null } : {}),
      ...(data.googleMapUrl !== undefined ? { googleMapUrl: data.googleMapUrl || null } : {}),
      ...(data.logo !== undefined ? { logo: data.logo || null } : {}),
      ...(data.favicon !== undefined ? { favicon: data.favicon || null } : {}),
      ...(data.ogImage !== undefined ? { ogImage: data.ogImage || null } : {}),
      ...(data.facebookUrl !== undefined ? { facebookUrl: data.facebookUrl || null } : {}),
      ...(data.instagramUrl !== undefined ? { instagramUrl: data.instagramUrl || null } : {}),
      ...(data.linkedinUrl !== undefined ? { linkedinUrl: data.linkedinUrl || null } : {}),
      ...(data.twitterUrl !== undefined ? { twitterUrl: data.twitterUrl || null } : {}),
      ...(data.youtubeUrl !== undefined ? { youtubeUrl: data.youtubeUrl || null } : {}),
      ...(data.defaultMetaTitle !== undefined ? { defaultMetaTitle: data.defaultMetaTitle || null } : {}),
      ...(data.defaultMetaDescription !== undefined ? { defaultMetaDescription: data.defaultMetaDescription || null } : {}),
      ...(data.defaultKeywords !== undefined ? { defaultKeywords: data.defaultKeywords || null } : {}),
      ...(data.officeHours !== undefined ? { officeHours: data.officeHours || null } : {}),
    },
  });

  revalidateCmsPaths(['/']);

  return apiSuccess(updatedSettings, 'Global settings updated successfully', undefined, 200);
});
