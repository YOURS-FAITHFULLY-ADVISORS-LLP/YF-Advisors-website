import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminHomepageWrapper from '@/src/admin/components/AdminHomepageWrapper';

export const metadata: Metadata = {
  title: 'Homepage & Hero Settings | Admin Portal',
  description: 'Manage homepage banner and hero content',
};

export default async function AdminHomepageSettingsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminHomepageWrapper adminId={session.id} />;
}
