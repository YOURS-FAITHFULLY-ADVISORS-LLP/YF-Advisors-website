export interface HomepageCMSData {
  id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage?: string | null;
  heroButtonText?: string | null;
  heroButtonLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisionPoint {
  id?: string;
  title: string;
  order?: number;
}

export interface MissionPoint {
  id?: string;
  title: string;
  order?: number;
}

export interface AboutStatistic {
  id?: string;
  title: string;
  value: string;
  icon?: string | null;
  order?: number;
}

export interface AboutCMSData {
  id: string;
  title: string;
  subtitle: string;
  whoWeAreTitle: string;
  whoWeAreContent: string;
  whyChooseTitle: string;
  whyChooseContent: string;
  visionPoints?: VisionPoint[];
  missionPoints?: MissionPoint[];
  statistics?: AboutStatistic[];
}

export async function fetchHomepageData(): Promise<HomepageCMSData | null> {
  try {
    const res = await fetch('/api/admin/homepage', {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data as HomepageCMSData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching homepage CMS data:', error);
    return null;
  }
}

export async function fetchAboutData(): Promise<AboutCMSData | null> {
  try {
    const res = await fetch('/api/admin/about', {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data as AboutCMSData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching about CMS data:', error);
    return null;
  }
}
