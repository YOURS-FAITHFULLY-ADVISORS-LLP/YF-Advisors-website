  import { prisma } from '@/src/lib/prisma';
import { HomepageCMSData } from '@/src/services/cms.service';

export async function getHomepageData(): Promise<HomepageCMSData | null> {
  try {
    const homepage = await prisma.homepage.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!homepage) return null;

    return {
      id: homepage.id,
      heroTitle: homepage.heroTitle,
      heroDescription: homepage.heroDescription,
      heroImage: homepage.heroImage,
      heroButtonText: homepage.heroButtonText,
      heroButtonLink: homepage.heroButtonLink,
      heroCards: homepage.heroCards,
      createdAt: homepage.createdAt.toISOString(),
      updatedAt: homepage.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching server-side homepage data:', error);
    return null;
  }
}
