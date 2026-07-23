import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminServicesWrapper from '@/src/admin/components/AdminServicesWrapper';

export const metadata: Metadata = {
  title: 'Add New Service | Admin Portal',
  description: 'Add a new service offering to YF Advisors catalog',
};

export default async function AdminNewServicePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminServicesWrapper adminId={session.id} isNew={true} />;
}
