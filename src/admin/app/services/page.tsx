import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminServicesWrapper from '@/src/admin/components/AdminServicesWrapper';

export const metadata: Metadata = {
  title: 'Services Catalog Management | Admin Portal',
  description: 'Manage services, offerings, capabilities, and benefits',
};

export default async function AdminServicesPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminServicesWrapper adminId={session.id} />;
}
