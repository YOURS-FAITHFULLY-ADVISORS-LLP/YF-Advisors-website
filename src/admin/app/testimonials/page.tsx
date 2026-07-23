import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminTestimonialsWrapper from '@/src/admin/components/AdminTestimonialsWrapper';

export const metadata: Metadata = {
  title: 'Testimonials Management | Admin Portal',
  description: 'Manage client reviews, ratings, and verified badges',
};

export default async function AdminTestimonialsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminTestimonialsWrapper adminId={session.id} />;
}
