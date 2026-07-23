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
