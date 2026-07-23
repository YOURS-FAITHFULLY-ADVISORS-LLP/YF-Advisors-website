import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username or Admin ID is required').trim(),
  password: z.string().min(1, 'Password is required').trim(),
});
