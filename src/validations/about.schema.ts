import { z } from 'zod';

export const visionPointSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Vision point title is required').trim(),
  order: z.number().int().default(0),
});

export const missionPointSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Mission point title is required').trim(),
  order: z.number().int().default(0),
});

export const aboutStatisticSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Statistic title is required').trim(),
  value: z.string().min(1, 'Statistic value is required').trim(),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const updateAboutSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').trim(),
  subtitle: z.string().min(2, 'Subtitle is required').trim(),
  whoWeAreTitle: z.string().min(2, 'Who We Are title is required').trim(),
  whoWeAreContent: z.string().min(5, 'Who We Are content is required').trim(),
  whyChooseTitle: z.string().min(2, 'Why Choose Us title is required').trim(),
  whyChooseContent: z.string().min(5, 'Why Choose Us content is required').trim(),
  visionPoints: z.array(visionPointSchema).optional(),
  missionPoints: z.array(missionPointSchema).optional(),
  statistics: z.array(aboutStatisticSchema).optional(),
});
