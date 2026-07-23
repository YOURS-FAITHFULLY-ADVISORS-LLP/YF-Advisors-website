'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Briefcase, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowUpRight, 
  RefreshCw,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export interface DashboardStats {
  blogs: {
    total: number;
    published: number;
    draft: number;
  };
  services: {
    total: number;
    published: number;
    draft: number;
  };
  team: {
    total: number;
    published: number;
  };
  testimonials: {
    total: number;
    verified: number;
  };
}

interface AdminDashboardViewProps {
  initialStats?: DashboardStats | null;
}

export default function AdminDashboardView({ initialStats }: AdminDashboardViewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(initialStats || null);
  const [loading, setLoading] = useState(!initialStats);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard/stats');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to fetch dashboard statistics');
      }
    } catch (err) {
      console.error(err);
      setError('Network error fetching statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialStats) {
      fetchStats();
    }
  }, [initialStats]);

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time content statistics and quick administrative actions.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#002B49]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. BLOGS CARD */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
              Blog Posts
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#002B49] group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-[#FDB913]" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold font-serif text-[#002B49]">
              {loading ? '...' : stats?.blogs.total ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Total Articles Created</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats?.blogs.published ?? 0} Published</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats?.blogs.draft ?? 0} Drafts</span>
            </div>
          </div>
        </div>

        {/* 2. SERVICES CARD */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
              Services Offered
            </span>
            <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00A79D] group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold font-serif text-[#002B49]">
              {loading ? '...' : stats?.services.total ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Total Services Cataloged</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats?.services.published ?? 0} Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats?.services.draft ?? 0} Inactive</span>
            </div>
          </div>
        </div>

        {/* 3. TEAM MEMBERS CARD */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
              Team Members
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-[#002B49] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold font-serif text-[#002B49]">
              {loading ? '...' : stats?.team.total ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Team Profiles</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats?.team.published ?? 0} Visible</span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal">Active Members</span>
          </div>
        </div>

        {/* 4. TESTIMONIALS CARD */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
              Testimonials
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold font-serif text-[#002B49]">
              {loading ? '...' : stats?.testimonials.total ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Client Reviews</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{stats?.testimonials.verified ?? 0} Verified</span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal">100% Rate</span>
          </div>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#002B49]">Quick Actions</h2>
            <p className="text-xs text-slate-400 font-medium">Manage and post new content directly to the live site.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/blogs/new"
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#002B49] bg-slate-50/50 hover:bg-white transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#002B49] text-white">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#002B49]">New Blog Article</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#002B49] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/services"
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#002B49] bg-slate-50/50 hover:bg-white transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#00A79D] text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#002B49]">Manage Services</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#002B49] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/team"
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#002B49] bg-slate-50/50 hover:bg-white transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#002B49]">Team Members</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#002B49] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <Link
            href="/admin/testimonials"
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-[#002B49] bg-slate-50/50 hover:bg-white transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#002B49]">Testimonials</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#002B49] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
