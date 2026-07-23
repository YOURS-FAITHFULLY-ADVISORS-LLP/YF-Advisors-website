'use client';

import React from 'react';
import { Menu, ShieldCheck, Bell } from 'lucide-react';

interface AdminHeaderProps {
  setMobileOpen: (open: boolean) => void;
  adminId?: string;
}

export default function AdminHeader({ setMobileOpen, adminId = 'Admin' }: AdminHeaderProps) {
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
            Admin Portal
          </span>
          <span className="text-slate-300 text-xs">/</span>
          <span className="text-xs font-medium text-slate-500">Dashboard</span>
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
