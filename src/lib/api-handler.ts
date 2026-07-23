import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { apiError } from './api-response';
import { authenticateAdminRequest } from '@/src/middleware/admin-auth';

type RouteHandler<T = any> = (
  req: NextRequest,
  context?: T
) => Promise<NextResponse> | NextResponse;

export function withApiHandler(handler: RouteHandler, options: { isPublic?: boolean } = {}) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      if (!options.isPublic) {
        const authError = await authenticateAdminRequest(req);
        if (authError) return authError;
      }

      return await handler(req, context);
    } catch (error: any) {
      console.error('API Error:', error);

      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(
          (err: any) => `${err.path.join('.')}: ${err.message}`
        );
        return apiError('Validation failed', errorMessages, 422);
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const targets = (error.meta?.target as string[]) || ['Field'];
          return apiError(
            `Duplicate record conflict`,
            [`A record with this ${targets.join(', ')} already exists.`],
            409
          );
        }

        if (error.code === 'P2025') {
          return apiError('Resource not found', ['The requested record does not exist.'], 404);
        }
      }

      return apiError(
        error.message || 'An internal server error occurred',
        [],
        500
      );
    }
  };
}

export function formatZodIssues(issues: any[]): string[] {
  return issues.map((e) => `${e.path.join('.')}: ${e.message}`);
}
