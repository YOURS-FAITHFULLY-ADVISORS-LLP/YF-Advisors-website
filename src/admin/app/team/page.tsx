import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminTeamWrapper from '@/src/admin/components/AdminTeamWrapper';

export const metadata: Metadata = {
  title: 'Team Management | Admin Portal',
  description: 'Manage leadership team and partner profiles',
};

export default async function AdminTeamPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminTeamWrapper adminId={session.id} />;
}
