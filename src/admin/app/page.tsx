import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/src/admin/components/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | YF Advisors',
  description: 'Admin Portal Dashboard for YF Advisors',
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient adminId={session.id} />;
}
