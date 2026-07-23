import { notFound } from 'next/navigation';
import AdminLoginPage from '@/src/admin/app/login/page';
import AdminDashboardPage from '@/src/admin/app/page';

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
    if (slug.length === 2 && slug[1] === 'login') {
      return <AdminLoginPage />;
    }
  }

  notFound();
}
