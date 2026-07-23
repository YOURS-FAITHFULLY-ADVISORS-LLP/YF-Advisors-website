import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminSettingsWrapper from '@/src/admin/components/AdminSettingsWrapper';

export const metadata: Metadata = {
  title: 'Global Settings | Admin Portal',
  description: 'Manage company information, branding, social links, and default SEO',
};

export default async function AdminSettingsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminSettingsWrapper adminId={session.id} />;
}
