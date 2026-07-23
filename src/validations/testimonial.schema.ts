import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  designation: z.string().min(2, 'Designation is required').trim(),
  company: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  initials: z.string().optional().nullable(),
  review: z.string().min(5, 'Review content must be at least 5 characters').trim(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').default(5),
  isVerified: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
  displayOrder: z.number().int().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
