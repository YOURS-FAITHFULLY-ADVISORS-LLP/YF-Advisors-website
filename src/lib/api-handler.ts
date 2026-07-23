import { NextRequest, NextResponse } from 'next/server';
import { ZodIssue } from 'zod';

type HandlerOptions = {
  isPublic?: boolean;
};

export function formatZodIssues(issues: ZodIssue[]) {
  return issues.map((issue) => {
    const path = issue.path.length ? `${issue.path.join('.')}: ` : '';
    return `${path}${issue.message}`;
  });
}

export function withApiHandler<T = any>(
  handler: (req: NextRequest, context: T) => Promise<Response | NextResponse>,
  _options: HandlerOptions = {}
) {
  return async (req: NextRequest, context: T) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API route error:', error);

      return NextResponse.json(
        {
          success: false,
          message: 'Internal server error',
          errors: ['An unexpected error occurred'],
        },
        { status: 500 }
      );
    }
  };
}
