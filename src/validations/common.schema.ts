import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const statusToggleSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED']),
});
