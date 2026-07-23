'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import TestimonialsList from './TestimonialsList';
import TestimonialEditor from './TestimonialEditor';

interface AdminTestimonialsWrapperProps {
  adminId: string;
  testimonialId?: string;
  isNew?: boolean;
}

export default function AdminTestimonialsWrapper({ adminId, testimonialId, isNew }: AdminTestimonialsWrapperProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex text-slate-800 font-sans">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        adminId={adminId}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          setMobileOpen={setMobileOpen}
          adminId={adminId}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {testimonialId || isNew ? (
            <TestimonialEditor testimonialId={testimonialId} />
          ) : (
            <TestimonialsList />
          )}
        </main>
      </div>
    </div>
  );
}
