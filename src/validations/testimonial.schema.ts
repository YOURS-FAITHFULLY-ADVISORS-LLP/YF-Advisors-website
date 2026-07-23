import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  company: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  initials: z.string().optional().nullable(),
  review: z.string().min(1, 'Review is required'),
  rating: z.number().int().min(1).max(5).default(5),
  isVerified: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
  displayOrder: z.number().int().nonnegative().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
