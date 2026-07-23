import type { Metadata } from 'next';
import LoginForm from '@/src/admin/components/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | YF Advisors',
  description: 'Admin Portal Login for YF Advisors',
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
