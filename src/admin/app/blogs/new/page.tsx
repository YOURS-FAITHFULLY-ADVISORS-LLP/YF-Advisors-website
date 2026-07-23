import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminBlogsWrapper from '@/src/admin/components/AdminBlogsWrapper';

export const metadata: Metadata = {
  title: 'Create Blog Post | Admin Portal',
  description: 'Create a new blog article for YF Advisors',
};

export default async function AdminNewBlogPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminBlogsWrapper adminId={session.id} isNew={true} />;
}
