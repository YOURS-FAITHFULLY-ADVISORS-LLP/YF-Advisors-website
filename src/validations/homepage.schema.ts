import { z } from 'zod';

export const updateHomepageSchema = z.object({
  heroTitle: z.string().min(2, 'Hero title must be at least 2 characters').trim(),
  heroDescription: z.string().min(5, 'Hero description must be at least 5 characters').trim(),
  heroImage: z.string().optional().nullable(),
  heroButtonText: z.string().optional().nullable(),
  heroButtonLink: z.string().optional().nullable(),
});
