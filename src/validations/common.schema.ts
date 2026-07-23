import { z } from 'zod';

export const statusToggleSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED']),
});
