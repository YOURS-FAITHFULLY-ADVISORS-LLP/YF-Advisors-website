import { notFound } from 'next/navigation';
import AdminLoginPage from '@/src/admin/app/login/page';
import AdminDashboardPage from '@/src/admin/app/page';
import AdminHomepageSettingsPage from '@/src/admin/app/homepage/page';
import AdminBlogsPage from '@/src/admin/app/blogs/page';
import AdminNewBlogPage from '@/src/admin/app/blogs/new/page';
import AdminEditBlogPage from '@/src/admin/app/blogs/[id]/page';
import AdminServicesPage from '@/src/admin/app/services/page';
import AdminNewServicePage from '@/src/admin/app/services/new/page';
import AdminEditServicePage from '@/src/admin/app/services/[id]/page';
import AdminTeamPage from '@/src/admin/app/team/page';
import AdminNewTeamPage from '@/src/admin/app/team/new/page';
import AdminEditTeamPage from '@/src/admin/app/team/[id]/page';
import AdminTestimonialsPage from '@/src/admin/app/testimonials/page';
import AdminNewTestimonialPage from '@/src/admin/app/testimonials/new/page';
import AdminEditTestimonialPage from '@/src/admin/app/testimonials/[id]/page';
import AdminSettingsPage from '@/src/admin/app/settings/page';

interface DynamicRouteProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function DynamicRoute({ params }: DynamicRouteProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  if (slug[0] === 'admin') {
    if (slug.length === 1) {
      return <AdminDashboardPage />;
    }
    if (slug.length === 2) {
      if (slug[1] === 'login') {
        return <AdminLoginPage />;
      }
      if (slug[1] === 'homepage' || slug[1] === 'hero') {
        return <AdminHomepageSettingsPage />;
      }
      if (slug[1] === 'blogs') {
        return <AdminBlogsPage />;
      }
      if (slug[1] === 'services') {
        return <AdminServicesPage />;
      }
      if (slug[1] === 'team') {
        return <AdminTeamPage />;
      }
      if (slug[1] === 'testimonials') {
        return <AdminTestimonialsPage />;
      }
      if (slug[1] === 'settings') {
        return <AdminSettingsPage />;
      }
    }
    if (slug.length === 3) {
      if (slug[1] === 'blogs') {
        if (slug[2] === 'new') {
          return <AdminNewBlogPage />;
        }
        return <AdminEditBlogPage params={Promise.resolve({ id: slug[2] })} />;
      }
      if (slug[1] === 'services') {
        if (slug[2] === 'new') {
          return <AdminNewServicePage />;
        }
        return <AdminEditServicePage params={Promise.resolve({ id: slug[2] })} />;
      }
      if (slug[1] === 'team') {
        if (slug[2] === 'new') {
          return <AdminNewTeamPage />;
        }
        return <AdminEditTeamPage params={Promise.resolve({ id: slug[2] })} />;
      }
      if (slug[1] === 'testimonials') {
        if (slug[2] === 'new') {
          return <AdminNewTestimonialPage />;
        }
        return <AdminEditTestimonialPage params={Promise.resolve({ id: slug[2] })} />;
      }
    }
  }

  notFound();
}
