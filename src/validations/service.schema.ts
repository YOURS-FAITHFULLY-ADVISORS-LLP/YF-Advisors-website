import { z } from 'zod';

export const serviceOfferingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  order: z.number().int().default(0),
});

export const serviceCapabilitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  order: z.number().int().default(0),
});

export const serviceBenefitSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  order: z.number().int().default(0),
});

export const whyChoosePointSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  order: z.number().int().default(0),
});

export const workStepSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number().int().positive('Step number must be positive'),
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
});

export const relatedServiceSchema = z.object({
  id: z.string().optional(),
  relatedId: z.string().min(1, 'Related service ID is required'),
  displayOrder: z.number().int().default(0),
});

export const createServiceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').trim(),
  slug: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  cardDescription: z.string().min(5, 'Card description must be at least 5 characters').trim(),
  keyValue: z.string().min(2, 'Key value is required').trim(),
  description: z.string().min(10, 'Full description must be at least 10 characters').trim(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  publishedAt: z.string().datetime().optional().nullable().or(z.date()).or(z.literal('')),
  offerings: z.array(serviceOfferingSchema).optional(),
  capabilities: z.array(serviceCapabilitySchema).optional(),
  benefits: z.array(serviceBenefitSchema).optional(),
  whyChooseUs: z.array(whyChoosePointSchema).optional(),
  workSteps: z.array(workStepSchema).optional(),
  relatedServices: z.array(relatedServiceSchema).optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
