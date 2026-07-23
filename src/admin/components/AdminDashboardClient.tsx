'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboardView, { DashboardStats } from './AdminDashboardView';

interface AdminDashboardClientProps {
  adminId: string;
  initialStats?: DashboardStats | null;
}

export default function AdminDashboardClient({ adminId, initialStats }: AdminDashboardClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex text-slate-800 font-sans">
      {/* Responsive Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        adminId={adminId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <AdminHeader
          setMobileOpen={setMobileOpen}
          adminId={adminId}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AdminDashboardView initialStats={initialStats} />
        </main>
      </div>
    </div>
  );
}
