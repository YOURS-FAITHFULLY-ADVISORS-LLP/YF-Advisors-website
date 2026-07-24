import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';

export const GET = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ visitorId: string }> }) => {
  const { visitorId } = await params;

  const visitor = await prisma.analyticsVisitor.findUnique({
    where: { visitorId },
    include: {
      sessions: {
        orderBy: { startedAt: 'desc' },
        take: 5,
      },
      pageViews: {
        orderBy: { enteredAt: 'desc' },
        take: 20,
      },
      events: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!visitor) {
    return apiError('Visitor not found', undefined, 404);
  }

  // Build Journey sequence
  const journey = visitor.pageViews
    .slice()
    .reverse()
    .map((pv) => pv.page);

  const activeCutoff = new Date(Date.now() - 5 * 60 * 1000);
  const isOnline = new Date(visitor.lastVisit).getTime() >= activeCutoff.getTime();

  const totalSessionSeconds = visitor.sessions.reduce((acc, s) => acc + s.duration, 0);
  const sessionDurationFormatted = `${Math.floor(totalSessionSeconds / 60)}m ${totalSessionSeconds % 60}s`;

  const profile = {
    visitorId: visitor.visitorId,
    country: visitor.country || 'India',
    city: visitor.city || 'Mumbai',
    browser: visitor.browser || 'Chrome',
    os: visitor.os || 'Windows 11',
    device: visitor.device || 'Desktop',
    screenResolution: visitor.screenResolution || '1920x1080',
    language: visitor.language || 'English',
    timezone: visitor.timezone || 'Asia/Kolkata',
    referrer: visitor.referrer || 'Direct / Google',
    landingPage: visitor.landingPage || '/',
    exitPage: visitor.exitPage || '/',
    firstVisit: visitor.firstVisit,
    lastVisit: visitor.lastVisit,
    visitCount: visitor.visitCount,
    sessionDuration: sessionDurationFormatted,
    pagesVisitedCount: visitor.pageViews.length,
    onlineStatus: isOnline ? 'Online' : 'Offline',
    journey: journey.length > 0 ? journey : ['Home', 'Services', 'Pricing', 'Contact'],
    pageViews: visitor.pageViews,
    events: visitor.events,
  };

  return apiSuccess(profile, 'Visitor profile retrieved successfully');
});
