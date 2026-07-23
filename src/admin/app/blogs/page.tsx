import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminBlogsWrapper from '@/src/admin/components/AdminBlogsWrapper';

export const metadata: Metadata = {
  title: 'Blog Articles Management | Admin Portal',
  description: 'Manage blog posts, insights, and sub-sections',
};

export default async function AdminBlogsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminBlogsWrapper adminId={session.id} />;
}
