import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  cardDescription: z.string().min(1, 'Card description is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  image: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  author: z.string().default('YF Advisors'),
  content: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export const updateBlogSchema = createBlogSchema.partial();
