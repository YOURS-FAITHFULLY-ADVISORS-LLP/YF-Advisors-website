import { z } from 'zod';

const orderedTitleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  order: z.number().int().nonnegative().optional(),
});

export const updateAboutSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  whoWeAreTitle: z.string().min(1, 'Who we are title is required'),
  whoWeAreContent: z.string().min(1, 'Who we are content is required'),
  whyChooseTitle: z.string().min(1, 'Why choose title is required'),
  whyChooseContent: z.string().min(1, 'Why choose content is required'),
  visionPoints: z.array(orderedTitleSchema),
  missionPoints: z.array(orderedTitleSchema),
  statistics: z.array(
    z.object({
      title: z.string().min(1, 'Statistic title is required'),
      value: z.string().min(1, 'Statistic value is required'),
      icon: z.string().optional().nullable(),
      order: z.number().int().nonnegative().optional(),
    })
  ),
});
