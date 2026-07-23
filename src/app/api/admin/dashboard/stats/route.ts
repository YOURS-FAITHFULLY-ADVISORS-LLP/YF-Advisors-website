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
    totalTeamMembers,
    publishedTeamMembers,
    totalTestimonials,
    verifiedTestimonials,
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
  ]);

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
  };

  return apiSuccess(stats, 'Dashboard statistics retrieved successfully', undefined, 200);
});
