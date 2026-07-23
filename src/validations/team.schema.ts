import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  profileImage: z.string().min(1, 'Profile image is required'),
  bio: z.string().min(1, 'Bio is required'),
  experience: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
  displayOrder: z.number().int().nonnegative().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();
