import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminServicesWrapper from '@/src/admin/components/AdminServicesWrapper';

export const metadata: Metadata = {
  title: 'Edit Service | Admin Portal',
  description: 'Edit service details, offerings, capabilities, and steps',
};

interface AdminEditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditServicePage({ params }: AdminEditServicePageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;

  return <AdminServicesWrapper adminId={session.id} serviceId={id} />;
}
