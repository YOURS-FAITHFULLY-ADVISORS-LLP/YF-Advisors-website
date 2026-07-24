import { withApiHandler } from '@/src/lib/api-handler';
import { apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';

export const GET = withApiHandler(async () => {
  const activeCutoff = new Date(Date.now() - 5 * 60 * 1000);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalServices,
    publishedServices,
    draftServices,
    totalTeamMembers,
    publishedTeamMembers,
    totalTestimonials,
    verifiedTestimonials,
    // Analytics overview
    totalVisitors,
    activeVisitors,
    totalPageViews,
    todayPageViews,
    // Recent form submissions
    totalSubmissions,
    newSubmissions,
    // Recent blogs
    recentBlogs,
    // Recent testimonials
    recentTestimonials,
    // Content created last 7 days
    blogsThisWeek,
    // Page view trend (last 7 days, per day)
    recentPageViews,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: 'PUBLISHED' } }),
    prisma.blog.count({ where: { status: 'DRAFT' } }),

    prisma.service.count(),
    prisma.service.count({ where: { status: 'PUBLISHED' } }),
    prisma.service.count({ where: { status: 'DRAFT' } }),

    prisma.team.count(),
    prisma.team.count({ where: { status: 'PUBLISHED' } }),

    prisma.testimonial.count(),
    prisma.testimonial.count({ where: { isVerified: true } }),

    // Analytics
    prisma.analyticsVisitor.count(),
    prisma.analyticsVisitor.count({ where: { lastVisit: { gte: activeCutoff } } }),
    prisma.analyticsPageView.count(),
    prisma.analyticsPageView.count({ where: { enteredAt: { gte: todayStart } } }),

    // Form submissions
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: 'NEW' } }),

    // Recent blogs (last 5)
    prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, createdAt: true, slug: true },
    }),

    // Recent testimonials (last 4)
    prisma.testimonial.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, company: true, isVerified: true, createdAt: true },
    }),

    // Blogs created in last 7 days
    prisma.blog.count({ where: { createdAt: { gte: last7Days } } }),

    // Page views for last 7 days (for sparkline)
    prisma.analyticsPageView.findMany({
      where: { enteredAt: { gte: last7Days } },
      select: { enteredAt: true },
    }),
  ]);

  // Build daily page view trend (last 7 days)
  const dailyTrend: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyTrend.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), count: 0 });
  }
  recentPageViews.forEach((pv) => {
    const idx = 6 - Math.floor((Date.now() - new Date(pv.enteredAt).getTime()) / (24 * 60 * 60 * 1000));
    if (idx >= 0 && idx < 7) dailyTrend[idx].count++;
  });

  const stats = {
    blogs: {
      total: totalBlogs,
      published: publishedBlogs,
      draft: draftBlogs,
    },
    services: {
      total: totalServices,
      published: publishedServices,
      draft: draftServices,
    },
    team: {
      total: totalTeamMembers,
      published: publishedTeamMembers,
    },
    testimonials: {
      total: totalTestimonials,
      verified: verifiedTestimonials,
    },
    analytics: {
      totalVisitors,
      activeVisitors,
      totalPageViews,
      todayPageViews,
      dailyTrend,
    },
    submissions: {
      total: totalSubmissions,
      new: newSubmissions,
    },
    recentBlogs,
    recentTestimonials,
    blogsThisWeek,
  };

  return apiSuccess(stats, 'Dashboard statistics retrieved successfully', undefined, 200);
});
