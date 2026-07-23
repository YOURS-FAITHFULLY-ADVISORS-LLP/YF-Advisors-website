import { z } from 'zod';

export const updateContactSchema = z.object({
  title: z.string().min(2, 'Title is required').trim(),
  officeTitle: z.string().min(2, 'Office title is required').trim(),
  address: z.string().min(5, 'Address is required').trim(),
  emailTitle: z.string().min(2, 'Email title is required').trim(),
  email: z.string().email('Invalid email address').trim(),
  phoneTitle: z.string().min(2, 'Phone title is required').trim(),
  phone: z.string().min(5, 'Phone number is required').trim(),
  googleMap: z.string().optional().nullable(),
  officeHours: z.string().optional().nullable(),
});
