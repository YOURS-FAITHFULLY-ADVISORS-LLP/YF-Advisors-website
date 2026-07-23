import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminTestimonialsWrapper from '@/src/admin/components/AdminTestimonialsWrapper';

export const metadata: Metadata = {
  title: 'Add Testimonial | Admin Portal',
  description: 'Add a new client review',
};

export default async function AdminNewTestimonialPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminTestimonialsWrapper adminId={session.id} isNew={true} />;
}
