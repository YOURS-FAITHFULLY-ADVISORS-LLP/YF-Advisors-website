import type { Metadata } from 'next';
import { getAdminSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminTeamWrapper from '@/src/admin/components/AdminTeamWrapper';

export const metadata: Metadata = {
  title: 'Edit Team Member | Admin Portal',
  description: 'Edit partner and leadership member details',
};

interface AdminEditTeamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditTeamPage({ params }: AdminEditTeamPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;

  return <AdminTeamWrapper adminId={session.id} memberId={id} />;
}
