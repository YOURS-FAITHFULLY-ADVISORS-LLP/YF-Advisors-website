import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { buildPaginationMeta, parseQueryParams } from '@/src/lib/pagination';
import { prisma } from '@/src/lib/prisma';
import { SubmissionStatus } from '@prisma/client';

export const GET = withApiHandler(async (req: NextRequest) => {
  const { page, limit, skip, search, status, sortBy, sortOrder } = parseQueryParams(req);

  const where: any = {};

  if (status && Object.values(SubmissionStatus).includes(status as SubmissionStatus)) {
    where.status = status as SubmissionStatus;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { service: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (['name', 'createdAt', 'status', 'service'].includes(sortBy)) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = 'desc';
  }

  const [total, submissions] = await Promise.all([
    prisma.contactSubmission.count({ where }),
    prisma.contactSubmission.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);
  return apiSuccess(submissions, 'Contact submissions retrieved successfully', meta, 200);
});
