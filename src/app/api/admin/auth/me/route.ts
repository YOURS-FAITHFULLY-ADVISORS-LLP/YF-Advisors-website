import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { getAdminFromSession } from '@/src/lib/auth';

export const GET = withApiHandler(async () => {
  const admin = await getAdminFromSession();
  if (!admin) {
    return apiError('Unauthorized', ['No active admin session found'], 401);
  }

  return apiSuccess({ admin }, 'Authenticated admin profile retrieved', undefined, 200);
});
