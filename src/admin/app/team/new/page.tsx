import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminTeamWrapper from '@/src/admin/components/AdminTeamWrapper';

export const metadata: Metadata = {
  title: 'Add Team Member | Admin Portal',
  description: 'Add a new team member to YF Advisors',
};

export default async function AdminNewTeamPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <AdminTeamWrapper adminId={session.id} isNew={true} />;
}
