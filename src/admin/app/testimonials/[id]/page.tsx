import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminTestimonialsWrapper from '@/src/admin/components/AdminTestimonialsWrapper';

export const metadata: Metadata = {
  title: 'Edit Testimonial | Admin Portal',
  description: 'Edit client review details',
};

interface AdminEditTestimonialPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditTestimonialPage({ params }: AdminEditTestimonialPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;

  return <AdminTestimonialsWrapper adminId={session.id} testimonialId={id} />;
}
