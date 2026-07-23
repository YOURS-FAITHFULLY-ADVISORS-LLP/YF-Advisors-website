import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { getAdminSession, verifyAdminToken } from '@/src/lib/auth';

export const GET = withApiHandler(async (req: NextRequest) => {
  // Check session cookie first
  let session = await getAdminSession();

  // If no cookie session, check Authorization Bearer header
  if (!session) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        session = verifyAdminToken(token);
      } catch {
        session = null;
      }
    }
  }

  if (!session) {
    return apiError('Unauthorized', ['No active admin session or token provided'], 401);
  }

  return apiSuccess(
    {
      user: {
        id: session.id,
        role: session.role,
      },
    },
    'Admin session is active',
    undefined,
    200
  );
});
