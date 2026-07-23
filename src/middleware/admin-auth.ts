import { NextRequest } from 'next/server';
import { getAdminFromSession, verifyAdminToken } from '@/src/lib/auth';
import { apiError } from '@/src/lib/api-response';

export async function authenticateAdminRequest(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow login endpoint without auth
  if (path === '/api/admin/auth/login') {
    return null;
  }

  // Check Bearer token header or HttpOnly cookie
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('admin_token')?.value;
  }

  if (!token) {
    return apiError('Unauthorized access', ['Authentication required'], 401);
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return apiError('Unauthorized access', ['Invalid or expired authentication token'], 401);
  }

  return null; // Authenticated cleanly
}
