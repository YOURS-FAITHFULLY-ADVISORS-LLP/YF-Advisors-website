import { z } from 'zod';

export const updateHomepageSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroDescription: z.string().min(1, 'Hero description is required'),
  heroImage: z.string().optional().nullable(),
  heroButtonText: z.string().optional().nullable(),
  heroButtonLink: z.string().optional().nullable(),
});
