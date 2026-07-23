import { NextResponse } from 'next/server';
import { ApiResponse, PaginationMeta } from '@/src/types/api';

export function apiSuccess<T = any>(
  data?: T,
  message: string = 'Success',
  meta?: PaginationMeta,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : { data: {} as T }),
    ...(meta ? { meta } : {}),
  };

  return NextResponse.json(body, { status: statusCode });
}

export function apiError(
  message: string = 'Internal server error',
  errors: string[] = [],
  statusCode: number = 400
): NextResponse<ApiResponse> {
  const body: ApiResponse = {
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : {}),
  };

  return NextResponse.json(body, { status: statusCode });
}
