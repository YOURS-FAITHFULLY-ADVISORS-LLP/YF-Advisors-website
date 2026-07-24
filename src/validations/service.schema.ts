import { z } from 'zod';

const offeringSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Offering title is required'),
  description: z.string().default(''),
  order: z.number().default(0),
});

const capabilitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Capability title is required'),
  description: z.string().default(''),
  order: z.number().default(0),
});

const benefitSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Benefit title is required'),
  description: z.string().default(''),
  order: z.number().default(0),
});

const whyChooseUsSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Why Choose Us title is required'),
  description: z.string().default(''),
  order: z.number().default(0),
});

const workStepSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number().default(1),
  title: z.string().min(1, 'Step title is required'),
  description: z.string().default(''),
});

export const createServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  cardDescription: z.string().min(1, 'Card description is required'),
  keyValue: z.string().min(1, 'Key value is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  offerings: z.array(offeringSchema).optional(),
  capabilities: z.array(capabilitySchema).optional(),
  benefits: z.array(benefitSchema).optional(),
  whyChooseUs: z.array(whyChooseUsSchema).optional(),
  workSteps: z.array(workStepSchema).optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
