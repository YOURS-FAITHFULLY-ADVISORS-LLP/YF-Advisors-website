import { z } from 'zod';

export const blogSectionSchema = z.object({
  heading: z.string().optional().nullable(),
  content: z.string().min(1, 'Section content is required').trim(),
  displayOrder: z.number().int().default(0),
});

export const createBlogSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long').trim(),
  slug: z.string().optional().nullable(),
  cardDescription: z.string().min(5, 'Card description must be at least 5 characters').trim(),
  excerpt: z.string().min(5, 'Excerpt must be at least 5 characters').trim(),
  image: z.string().url('Invalid image URL').optional().nullable().or(z.literal('')),
  category: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  author: z.string().trim().default('YF Advisors'),
  content: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  publishedAt: z.string().datetime().optional().nullable().or(z.date()).or(z.literal('')),
  sections: z.array(blogSectionSchema).optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const reorderSectionsSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string().min(1, 'Section ID is required'),
      displayOrder: z.number().int(),
    })
  ).min(1, 'At least one section must be provided'),
});
