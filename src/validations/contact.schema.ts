import { z } from 'zod';

export const updateContactSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  officeTitle: z.string().min(1, 'Office title is required'),
  address: z.string().min(1, 'Address is required'),
  emailTitle: z.string().min(1, 'Email title is required'),
  email: z.string().email('Valid email is required'),
  phoneTitle: z.string().min(1, 'Phone title is required'),
  phone: z.string().min(1, 'Phone is required'),
  googleMap: z.string().optional().nullable(),
  officeHours: z.string().optional().nullable(),
});
