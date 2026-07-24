'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  setMobileOpen: (open: boolean) => void;
  adminId?: string;
}

export default function AdminHeader({ setMobileOpen, adminId = 'Admin' }: AdminHeaderProps) {
  const pathname = usePathname() || '/admin';

  React.useEffect(() => {
    document.title = 'Admin Panel';
  }, []);

  const getBreadcrumb = () => {
    const parts = pathname.split('/').filter(Boolean);

    // If exactly /admin
    if (parts.length === 1 && parts[0] === 'admin') {
      return [{ label: 'Dashboard', href: '/admin' }];
    }

    if (parts[1] === 'homepage' || parts[1] === 'hero') {
      return [{ label: 'Homepage & Hero', href: '/admin/homepage' }];
    }

    if (parts[1] === 'contact') {
      return [{ label: 'Contact Settings', href: '/admin/contact' }];
    }

    if (parts[1] === 'blogs') {
      const items = [{ label: 'Blogs', href: '/admin/blogs' }];
      if (parts[2] === 'new') {
        items.push({ label: 'New Article', href: '/admin/blogs/new' });
      } else if (parts[2]) {
        items.push({ label: 'Edit Article', href: `/admin/blogs/${parts[2]}` });
      }
      return items;
    }

    if (parts[1] === 'services') {
      const items = [{ label: 'Services Catalog', href: '/admin/services' }];
      if (parts[2] === 'new') {
        items.push({ label: 'New Service', href: '/admin/services/new' });
      } else if (parts[2]) {
        items.push({ label: 'Edit Service', href: `/admin/services/${parts[2]}` });
      }
      return items;
    }

    if (parts[1] === 'team') {
      const items = [{ label: 'Team Members', href: '/admin/team' }];
      if (parts[2] === 'new') {
        items.push({ label: 'Add Member', href: '/admin/team/new' });
      } else if (parts[2]) {
        items.push({ label: 'Edit Member', href: `/admin/team/${parts[2]}` });
      }
      return items;
    }

    if (parts[1] === 'testimonials') {
      const items = [{ label: 'Testimonials', href: '/admin/testimonials' }];
      if (parts[2] === 'new') {
        items.push({ label: 'Add Review', href: '/admin/testimonials/new' });
      } else if (parts[2]) {
        items.push({ label: 'Edit Review', href: `/admin/testimonials/${parts[2]}` });
      }
      return items;
    }

    if (parts[1] === 'settings') {
      return [{ label: 'Global Settings', href: '/admin/settings' }];
    }

    // Default fallback
    const capitalized = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'Dashboard';
    return [{ label: capitalized, href: pathname }];
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#002B49] hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin"
            className="font-bold uppercase tracking-wider text-[#002B49] hover:text-[#00A79D] transition-colors"
          >
            Admin Portal
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href + idx}>
              <span className="text-slate-300 font-bold">/</span>
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-slate-700">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="font-medium text-slate-500 hover:text-[#002B49] transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right User Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-[#002B49]">
          <ShieldCheck className="w-4 h-4 text-[#FDB913]" />
          <span className="hidden sm:inline font-bold">{adminId}</span>
        </div>
      </div>
    </header>
  );
}
