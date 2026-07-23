import { NextResponse } from 'next/server';

type ApiMeta = Record<string, unknown>;

export function apiSuccess<T>(
  data: T,
  message = 'Success',
  meta?: ApiMeta,
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

export function apiError(message: string, errors: string[] = [], status = 500) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}
