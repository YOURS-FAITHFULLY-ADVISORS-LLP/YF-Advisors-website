import { z } from 'zod';

export const updateSettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyEmail: z.string().optional().nullable(),
  companyPhone: z.string().optional().nullable(),
  companyAddress: z.string().optional().nullable(),
  googleMapUrl: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  defaultMetaTitle: z.string().optional().nullable(),
  defaultMetaDescription: z.string().optional().nullable(),
  defaultKeywords: z.string().optional().nullable(),
  officeHours: z.string().optional().nullable(),
});
