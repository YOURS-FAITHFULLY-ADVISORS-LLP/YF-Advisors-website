import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiSuccess } from '@/src/lib/api-response';
import { buildPaginationMeta, parseQueryParams } from '@/src/lib/pagination';
import { prisma } from '@/src/lib/prisma';

export const GET = withApiHandler(async (req: NextRequest) => {
  const { page, limit, skip, search } = parseQueryParams(req);
  const { searchParams } = new URL(req.url);

  const country = searchParams.get('country');
  const device = searchParams.get('device');
  const browser = searchParams.get('browser');
  const onlineOnly = searchParams.get('online') === 'true';

  const where: any = {};

  if (search) {
    where.OR = [
      { visitorId: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { landingPage: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (country) where.country = country;
  if (device) where.device = device;
  if (browser) where.browser = browser;

  if (onlineOnly) {
    const activeCutoff = new Date(Date.now() - 5 * 60 * 1000);
    where.lastVisit = { gte: activeCutoff };
  }

  const sortBy = searchParams.get('sortBy') || 'visitorId';
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

  let orderBy: any = { visitorId: 'desc' };
  if (sortBy === 'lastVisit') {
    orderBy = { lastVisit: sortOrder };
  } else if (sortBy === 'firstVisit') {
    orderBy = { firstVisit: sortOrder };
  } else {
    orderBy = { visitorId: sortOrder };
  }

  const [total, visitors] = await Promise.all([
    prisma.analyticsVisitor.count({ where }),
    prisma.analyticsVisitor.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
  ]);

  const activeCutoff = new Date(Date.now() - 5 * 60 * 1000);
  const formattedVisitors = visitors.map((v) => ({
    ...v,
    status: new Date(v.lastVisit).getTime() >= activeCutoff.getTime() ? 'Online' : 'Offline',
  }));

  const meta = buildPaginationMeta(total, page, limit);
  return apiSuccess(formattedVisitors, 'Visitors list retrieved successfully', meta, 200);
});
