import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  cardDescription: z.string().min(1, 'Card description is required'),
  keyValue: z.string().min(1, 'Key value is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export const updateServiceSchema = createServiceSchema.partial();
