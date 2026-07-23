import { NextRequest } from 'next/server';
import { PaginationMeta, QueryParams } from '@/src/types/api';

export function parseQueryParams(req: NextRequest): {
  page: number;
  limit: number;
  skip: number;
  search: string;
  status?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  category?: string;
  author?: string;
  isVerified?: boolean;
} {
  const searchParams = req.nextUrl.searchParams;

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const rawLimit = parseInt(searchParams.get('limit') || '10', 10);
  const limit = Math.min(100, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  const search = (searchParams.get('search') || '').trim();
  const status = searchParams.get('status')?.trim() || undefined;
  const sortBy = searchParams.get('sortBy')?.trim() || 'createdAt';
  const rawSortOrder = searchParams.get('sortOrder')?.toLowerCase();
  const sortOrder: 'asc' | 'desc' = rawSortOrder === 'asc' ? 'asc' : 'desc';

  const category = searchParams.get('category')?.trim() || undefined;
  const author = searchParams.get('author')?.trim() || undefined;

  const verifiedParam = searchParams.get('isVerified');
  const isVerified = verifiedParam === 'true' ? true : verifiedParam === 'false' ? false : undefined;

  return {
    page,
    limit,
    skip,
    search,
    status,
    sortBy,
    sortOrder,
    category,
    author,
    isVerified,
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
