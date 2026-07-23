import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminBlogsWrapper from '@/src/admin/components/AdminBlogsWrapper';

export const metadata: Metadata = {
  title: 'Edit Blog Article | Admin Portal',
  description: 'Edit blog post details and sub-sections',
};

interface AdminEditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditBlogPage({ params }: AdminEditBlogPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;

  return <AdminBlogsWrapper adminId={session.id} blogId={id} />;
}
