import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { loginSchema } from '@/src/validations/auth.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { signAdminToken, setAdminSessionCookie } from '@/src/lib/auth';

export const POST = withApiHandler(
  async (req: NextRequest) => {
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
    }

    const { username, password } = validation.data;

    const envAdminId = process.env.ADMIN_ID;
    const envAdminPass = process.env.ADMIN_PASS;

    if (!envAdminId || !envAdminPass) {
      return apiError(
        'Admin authentication credentials are not configured on the server',
        [],
        500
      );
    }

    if (username !== envAdminId) {
      return apiError('Invalid credentials', ['Incorrect Admin ID or Password'], 401);
    }

    const isBcryptHash = envAdminPass.startsWith('$2b$') || envAdminPass.startsWith('$2a$');
    const passwordMatches = isBcryptHash
      ? await bcrypt.compare(password, envAdminPass)
      : password === envAdminPass;

    if (!passwordMatches) {
      return apiError('Invalid credentials', ['Incorrect Admin ID or Password'], 401);
    }

    const token = signAdminToken({ id: envAdminId, role: 'admin' });
    await setAdminSessionCookie(token);

    return apiSuccess(
      {
        user: {
          id: envAdminId,
          role: 'admin',
        },
        token,
      },
      'Admin logged in successfully',
      undefined,
      200
    );
  },
  { isPublic: true }
);
