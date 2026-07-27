import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';

export const GET = withApiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '7d'; // 'today' | '7d' | '30d' | '12m'

  const now = new Date();
  let startDate = new Date();

  if (range === 'today') {
    // IST midnight = UTC previous day 18:30
    const istMidnight = new Date(now);
    istMidnight.setUTCHours(0, 0, 0, 0);
    // Shift to IST: midnight IST = 18:30 UTC previous day
    istMidnight.setTime(istMidnight.getTime() - 5.5 * 60 * 60 * 1000);
    // If we're still before IST midnight (shouldn't happen in practice), adjust
    if (istMidnight.getTime() > now.getTime()) {
      istMidnight.setTime(istMidnight.getTime() - 24 * 60 * 60 * 1000);
    }
    startDate = istMidnight;
  } else if (range === '7d') {
    startDate.setDate(now.getDate() - 7);
  } else if (range === '30d') {
    startDate.setDate(now.getDate() - 30);
  } else if (range === '12m') {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  const activeCutoff = new Date(now.getTime() - 5 * 60 * 1000); // last 5 mins

  const [
    totalVisitors,
    uniqueVisitors,
    activeVisitors,
    totalPageViews,
    sessions,
    bounces,
    visitorsByCountry,
    visitorsByCity,
    visitorsByDevice,
    visitorsByBrowser,
    visitorsByOs,
    pageViewsGrouped,
    eventsGrouped,
    recentActivity,
    recentVisitorsRaw,
    allPageViewsInRange,
  ] = await Promise.all([
    // Overview Cards
    prisma.analyticsVisitor.count(),
    prisma.analyticsVisitor.count({ where: { firstVisit: { gte: startDate } } }),
    prisma.analyticsVisitor.count({ where: { lastVisit: { gte: activeCutoff } } }),
    prisma.analyticsPageView.count({ where: { enteredAt: { gte: startDate } } }),
    prisma.analyticsSession.findMany({
      where: { startedAt: { gte: startDate } },
      select: { duration: true, bounce: true, pages: true },
    }),
    prisma.analyticsSession.count({
      where: { startedAt: { gte: startDate }, bounce: true },
    }),

    // Demographics
    prisma.analyticsVisitor.groupBy({
      by: ['country'],
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 5,
    }),
    prisma.analyticsVisitor.groupBy({
      by: ['city'],
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
      take: 5,
    }),
    prisma.analyticsVisitor.groupBy({
      by: ['device'],
      _count: { device: true },
      orderBy: { _count: { device: 'desc' } },
    }),
    prisma.analyticsVisitor.groupBy({
      by: ['browser'],
      _count: { browser: true },
      orderBy: { _count: { browser: 'desc' } },
    }),
    prisma.analyticsVisitor.groupBy({
      by: ['os'],
      _count: { os: true },
      orderBy: { _count: { os: 'desc' } },
    }),

    // Most Visited Pages
    prisma.analyticsPageView.groupBy({
      by: ['page'],
      _count: { page: true },
      _avg: { timeSpent: true },
      orderBy: { _count: { page: 'desc' } },
      take: 6,
    }),

    // Conversions & Button Clicks
    prisma.analyticsEvent.groupBy({
      by: ['eventType', 'buttonName'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),

    // Recent Activity Feed
    prisma.analyticsEvent.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { visitor: { select: { visitorId: true } } },
    }),

    // Recent Visitors list
    prisma.analyticsVisitor.findMany({
      take: 6,
      orderBy: { visitorId: 'desc' },
      select: {
        visitorId: true,
        exitPage: true,
        device: true,
        browser: true,
        country: true,
        city: true,
        lastVisit: true,
      },
    }),

    // All page views in range for building real visitor trends
    prisma.analyticsPageView.findMany({
      where: { enteredAt: { gte: startDate } },
      select: { enteredAt: true },
    }),
  ]);

  // Calculate Average Session Duration & Bounce Rate
  const totalSessionCount = sessions.length || 1;
  const totalDuration = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const avgSessionSeconds = Math.round(totalDuration / totalSessionCount);
  const avgSessionFormatted = sessions.length > 0
    ? `${Math.floor(avgSessionSeconds / 60)}m ${avgSessionSeconds % 60}s`
    : '0m 0s';

  const bouncesCount = sessions.filter(s => s.bounce && s.duration < 10 && (s.pages || 1) <= 1).length;
  const bounceRate = sessions.length > 0
    ? Math.round((bouncesCount / totalSessionCount) * 100)
    : 0;

  // ── IST Timezone Helper (UTC+5:30) ──
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const toIST = (date: Date) => new Date(date.getTime() + IST_OFFSET_MS);
  const nowIST = toIST(now);

  // ── Build REAL Visitor Trends from DB data ──
  const trendDays: { day: string; count: number }[] = [];

  if (range === 'today') {
    // Group by IST hour for "today"
    const currentISTHour = nowIST.getUTCHours();
    const hourCounts: Record<number, number> = {};
    for (let h = 0; h <= currentISTHour; h++) hourCounts[h] = 0;
    allPageViewsInRange.forEach((pv) => {
      const pvIST = toIST(new Date(pv.enteredAt));
      const hour = pvIST.getUTCHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    Object.keys(hourCounts)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((h) => {
        const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
        trendDays.push({ day: label, count: hourCounts[h] });
      });
  } else if (range === '12m') {
    // Group by month for "12 months"
    const monthCounts: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(nowIST);
      d.setUTCMonth(d.getUTCMonth() - i);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      monthCounts[key] = 0;
    }
    allPageViewsInRange.forEach((pv) => {
      const d = toIST(new Date(pv.enteredAt));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      if (key in monthCounts) monthCounts[key]++;
    });
    Object.entries(monthCounts).forEach(([key, count]) => {
      const [year, month] = key.split('-');
      const label = new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'short' });
      trendDays.push({ day: label, count });
    });
  } else {
    // Group by IST day for "7d" or "30d"
    const numDays = range === '7d' ? 7 : 30;
    const dayCounts: Record<string, number> = {};
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(nowIST);
      d.setUTCDate(d.getUTCDate() - i);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      dayCounts[key] = 0;
    }
    allPageViewsInRange.forEach((pv) => {
      const d = toIST(new Date(pv.enteredAt));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      if (key in dayCounts) dayCounts[key]++;
    });
    Object.entries(dayCounts).forEach(([key, count]) => {
      const [y, m, d] = key.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const label = range === '30d'
        ? dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      trendDays.push({ day: label, count });
    });
  }

  // Format Devices percentage
  const totalDeviceCount = visitorsByDevice.reduce((acc, curr) => acc + curr._count.device, 0) || 1;
  const devicesFormatted = visitorsByDevice.map((item) => ({
    name: item.device || 'Unknown',
    count: item._count.device,
    percentage: Math.round((item._count.device / totalDeviceCount) * 100),
  }));

  // Recent Visitors with Status (Online/Offline)
  const recentVisitors = recentVisitorsRaw.map((v) => ({
    ...v,
    status: new Date(v.lastVisit).getTime() >= activeCutoff.getTime() ? 'Online' : 'Offline',
  }));

  const data = {
    overview: {
      totalVisitors,
      uniqueVisitors,
      activeVisitors,
      totalPageViews,
      avgSession: avgSessionFormatted,
      bounceRate: `${bounceRate}%`,
    },
    visitorTrends: trendDays,
    countries: visitorsByCountry.map((c) => ({ country: c.country || 'Unknown', count: c._count.country })),
    cities: visitorsByCity.map((c) => ({ city: c.city || 'Unknown', count: c._count.city })),
    devices: devicesFormatted,
    browsers: visitorsByBrowser.map((b) => ({ name: b.browser || 'Unknown', count: b._count.browser })),
    operatingSystems: visitorsByOs.map((o) => ({ name: o.os || 'Unknown', count: o._count.os })),
    mostVisitedPages: pageViewsGrouped.map((p, idx) => ({
      rank: idx + 1,
      page: p.page,
      views: p._count.page,
      avgTimeSpent: p._avg.timeSpent
        ? `${Math.floor(p._avg.timeSpent / 60)}m ${Math.round(p._avg.timeSpent % 60)}s`
        : '0s',
    })),
    recentVisitors,
    recentActivity: recentActivity.map((a) => ({
      visitorId: a.visitor.visitorId,
      action: a.buttonName ? `Clicked ${a.buttonName}` : a.eventType,
      page: a.page,
      time: a.createdAt,
    })),
    buttonAnalytics: eventsGrouped
      .filter((e) => e.buttonName)
      .map((e) => ({
        button: e.buttonName,
        clicks: e._count.id,
      })),
  };

  return apiSuccess(data, 'Dashboard analytics retrieved successfully');
});
