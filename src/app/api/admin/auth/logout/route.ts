import { withApiHandler } from '@/src/lib/api-handler';
import { apiSuccess } from '@/src/lib/api-response';
import { clearAdminSessionCookie } from '@/src/lib/auth';

export const POST = withApiHandler(async () => {
  await clearAdminSessionCookie();

  return apiSuccess(
    null,
    'Admin logged out successfully',
    undefined,
    200
  );
});
