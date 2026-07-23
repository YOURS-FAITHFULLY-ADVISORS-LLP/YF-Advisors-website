import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  designation: z.string().min(2, 'Designation is required').trim(),
  profileImage: z.string().min(1, 'Profile image is required').trim(),
  bio: z.string().min(5, 'Bio must be at least 5 characters').trim(),
  experience: z.string().optional().nullable(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
  displayOrder: z.number().int().default(0),
});

export const updateTeamSchema = createTeamSchema.partial();
