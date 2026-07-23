import { z } from 'zod';

export const updateSettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required').trim(),
  companyEmail: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  companyPhone: z.string().optional().nullable(),
  companyAddress: z.string().optional().nullable(),
  googleMapUrl: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  facebookUrl: z.string().url('Invalid Facebook URL').optional().nullable().or(z.literal('')),
  instagramUrl: z.string().url('Invalid Instagram URL').optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  twitterUrl: z.string().url('Invalid Twitter URL').optional().nullable().or(z.literal('')),
  youtubeUrl: z.string().url('Invalid YouTube URL').optional().nullable().or(z.literal('')),
  defaultMetaTitle: z.string().optional().nullable(),
  defaultMetaDescription: z.string().optional().nullable(),
  defaultKeywords: z.string().optional().nullable(),
  officeHours: z.string().optional().nullable(),
});
