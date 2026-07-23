'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles,
  Info,
  FileText, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  adminId?: string;
}

export default function AdminSidebar({ mobileOpen, setMobileOpen, adminId = 'Admin' }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Homepage / Hero', href: '/admin/homepage', icon: Sparkles },
    { name: 'About Section', href: '/admin/about', icon: Info },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 text-slate-800">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative h-10 w-12 shrink-0">
            <Image
              src="/logo.png"
              alt="YF Advisors"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center leading-none select-none text-[#002B49]">
            <span className="font-serif text-[11px] font-bold tracking-[0.2em] uppercase mb-0.5">
              Yours Faithfully
            </span>
            <div className="w-full h-[1.5px] bg-[#FDB913] rounded-full" />
            <span className="font-serif text-[11px] font-bold tracking-[0.2em] uppercase mt-0.5 text-center">
              Advisors
            </span>
          </div>
        </Link>
        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                active
                  ? 'bg-[#002B49] text-white shadow-md shadow-[#002B49]/15 font-bold'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-[#002B49]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-[#FDB913]' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {active && <ChevronRight className="w-3.5 h-3.5 text-[#FDB913]" />}
            </Link>
          );
        })}
      </div>

      {/* Admin User Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#002B49]/10 border border-[#002B49]/20 text-[#002B49] flex items-center justify-center font-bold text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#002B49]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#002B49] truncate">{adminId}</p>
            <p className="text-[10px] text-slate-400 truncate">Administrator</p>
          </div>
        </div>

        <form action="/api/admin/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30 shadow-xs">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Overlay & Slide-in) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
