import { NextRequest } from 'next/server';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseQueryParams(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE);
  const limit = Math.min(parsePositiveInt(searchParams.get('limit'), DEFAULT_LIMIT), MAX_LIMIT);
  const skip = (page - 1) * limit;
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';

  return {
    page,
    limit,
    skip,
    search: searchParams.get('search')?.trim() || '',
    status: searchParams.get('status')?.trim() || '',
    isVerified:
      searchParams.get('isVerified') === null
        ? undefined
        : searchParams.get('isVerified') === 'true',
    sortBy: searchParams.get('sortBy')?.trim() || '',
    sortOrder,
  };
}

export function buildPaginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  };
}
