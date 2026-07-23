import { notFound } from 'next/navigation';
import AdminLoginPage from '@/src/admin/app/login/page';
import AdminDashboardPage from '@/src/admin/app/page';
import AdminHomepageSettingsPage from '@/src/admin/app/homepage/page';

interface DynamicRouteProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function DynamicRoute({ params }: DynamicRouteProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  if (slug[0] === 'admin') {
    if (slug.length === 1) {
      return <AdminDashboardPage />;
    }
    if (slug.length === 2) {
      if (slug[1] === 'login') {
        return <AdminLoginPage />;
      }
      if (slug[1] === 'homepage' || slug[1] === 'hero') {
        return <AdminHomepageSettingsPage />;
      }
    }
  }

  notFound();
}
