import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';

export const GET = withApiHandler(async () => {
  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalServices,
    publishedServices,
    draftServices,
    totalTestimonials,
    publishedTestimonials,
    draftTestimonials,
    totalTeamMembers,
    publishedTeamMembers,
    draftTeamMembers,
    latestBlogs,
    latestServices,
    latestTestimonials,
    latestTeamMembers,
    latestBlogDrafts,
    latestServiceDrafts,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: 'PUBLISHED' } }),
    prisma.blog.count({ where: { status: 'DRAFT' } }),

    prisma.service.count(),
    prisma.service.count({ where: { status: 'PUBLISHED' } }),
    prisma.service.count({ where: { status: 'DRAFT' } }),

    prisma.testimonial.count(),
    prisma.testimonial.count({ where: { status: 'PUBLISHED' } }),
    prisma.testimonial.count({ where: { status: 'DRAFT' } }),

    prisma.team.count(),
    prisma.team.count({ where: { status: 'PUBLISHED' } }),
    prisma.team.count({ where: { status: 'DRAFT' } }),

    prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, status: true, publishedAt: true, createdAt: true, updatedAt: true },
    }),
    prisma.service.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, status: true, publishedAt: true, createdAt: true, updatedAt: true },
    }),
    prisma.testimonial.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, designation: true, company: true, rating: true, status: true, createdAt: true, updatedAt: true },
    }),
    prisma.team.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, designation: true, status: true, displayOrder: true, createdAt: true, updatedAt: true },
    }),

    prisma.blog.findMany({
      where: { status: 'DRAFT' },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { status: 'DRAFT' },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, slug: true, updatedAt: true },
    }),
  ]);

  const lastUpdatedBlog = latestBlogs[0]?.updatedAt;
  const lastUpdatedService = latestServices[0]?.updatedAt;
  const lastUpdatedTestimonial = latestTestimonials[0]?.updatedAt;
  const lastUpdatedTeam = latestTeamMembers[0]?.updatedAt;

  const dashboardData = {
    counts: {
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
      testimonials: {
        total: totalTestimonials,
        published: publishedTestimonials,
        draft: draftTestimonials,
      },
      team: {
        total: totalTeamMembers,
        published: publishedTeamMembers,
        draft: draftTeamMembers,
      },
    },
    latestItems: {
      blogs: latestBlogs,
      services: latestServices,
      testimonials: latestTestimonials,
      teamMembers: latestTeamMembers,
    },
    latestDrafts: {
      blogs: latestBlogDrafts,
      services: latestServiceDrafts,
    },
    lastUpdated: {
      blogs: lastUpdatedBlog || null,
      services: lastUpdatedService || null,
      testimonials: lastUpdatedTestimonial || null,
      team: lastUpdatedTeam || null,
    },
  };

  return apiSuccess(dashboardData, 'Dashboard statistics retrieved successfully', undefined, 200);
});
