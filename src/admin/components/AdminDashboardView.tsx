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
  ShieldCheck,
  Eye,
  Activity,
  Inbox,
  BarChart3,
  Globe,
  ChevronRight,
  Zap,
  CalendarDays,
  Mail
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
  analytics: {
    totalVisitors: number;
    activeVisitors: number;
    totalPageViews: number;
    todayPageViews: number;
    dailyTrend: { day: string; count: number }[];
  };
  submissions: {
    total: number;
    new: number;
  };
  recentBlogs: { id: string; title: string; status: string; createdAt: string; slug: string }[];
  recentTestimonials: { id: string; name: string; company: string; isVerified: boolean; createdAt: string }[];
  blogsThisWeek: number;
}

interface AdminDashboardViewProps {
  initialStats?: DashboardStats | null;
}

// Mini sparkline chart component (pure CSS)
function Sparkline({ data, color = '#00A79D' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {data.map((val, i) => {
        const h = Math.max(3, Math.round((val / max) * 100));
        return (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-300 min-w-[4px]"
            style={{
              height: `${h}%`,
              backgroundColor: i === data.length - 1 ? color : `${color}40`,
            }}
          />
        );
      })}
    </div>
  );
}

// Donut chart component (pure SVG)
function DonutChart({
  segments,
  size = 100,
  strokeWidth = 18,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashLen = pct * circumference;
          const dashOff = offset * circumference;
          offset += pct;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={-dashOff}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-[#002B49]">{total}</span>
        <span className="text-[9px] text-slate-400 font-semibold uppercase">Total</span>
      </div>
    </div>
  );
}

// Progress bar component
function ProgressBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
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

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time content statistics and website performance at a glance.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#002B49]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* ═══════════════ ROW 1: Stats Cards ═══════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Blog Posts */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Blog Posts</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-[#FDB913] group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#002B49]">
            {loading ? '—' : stats?.blogs.total ?? 0}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold">
            <span className="text-emerald-600">{stats?.blogs.published ?? 0} Live</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">{stats?.blogs.draft ?? 0} Draft</span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Services</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-[#00A79D] group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#002B49]">
            {loading ? '—' : stats?.services.total ?? 0}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold">
            <span className="text-emerald-600">{stats?.services.published ?? 0} Active</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">{stats?.services.draft ?? 0} Inactive</span>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#002B49]">
            {loading ? '—' : stats?.team.total ?? 0}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold">
            <span className="text-emerald-600">{stats?.team.published ?? 0} Visible</span>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reviews</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#002B49]">
            {loading ? '—' : stats?.testimonials.total ?? 0}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold">
            <span className="text-emerald-600">{stats?.testimonials.verified ?? 0} Verified</span>
          </div>
        </div>

        {/* Total Visitors */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visitors</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#002B49]">
            {loading ? '—' : stats?.analytics?.totalVisitors ?? 0}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats?.analytics?.activeVisitors ?? 0} Online
            </span>
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inquiries</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#002B49]">
            {loading ? '—' : stats?.submissions?.total ?? 0}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold">
            {(stats?.submissions?.new ?? 0) > 0 ? (
              <span className="text-amber-600">{stats?.submissions?.new} New</span>
            ) : (
              <span className="text-slate-400">All Read</span>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ ROW 2: Charts & Content Distribution ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 📈 Website Traffic Mini-Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#002B49]">Website Traffic</h2>
              <p className="text-[11px] text-slate-400 font-medium">Page views over the last 7 days</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xl font-extrabold text-[#002B49]">{stats?.analytics?.totalPageViews ?? 0}</div>
                <div className="text-[10px] text-slate-400 font-semibold">Total Views</div>
              </div>
              <div className="text-right pl-3 border-l border-slate-100">
                <div className="text-xl font-extrabold text-[#00A79D]">{stats?.analytics?.todayPageViews ?? 0}</div>
                <div className="text-[10px] text-slate-400 font-semibold">Today</div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          {stats?.analytics?.dailyTrend && stats.analytics.dailyTrend.length > 0 ? (
            <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-50">
              {stats.analytics.dailyTrend.map((t, idx) => {
                const max = Math.max(...stats.analytics.dailyTrend.map(d => d.count), 1);
                const heightPercent = Math.min(100, Math.round((t.count / max) * 100));
                const isToday = idx === stats.analytics.dailyTrend.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className={`text-[10px] font-bold transition-opacity ${isToday || t.count > 0 ? 'text-[#002B49] opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>
                      {t.count}
                    </span>
                    <div
                      style={{ height: `${Math.max(heightPercent, t.count > 0 ? 6 : 2)}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-[#00A79D] to-[#00C9B7] shadow-sm'
                          : 'bg-[#002B49]/80 group-hover:bg-[#002B49]'
                      }`}
                    />
                    <span className={`text-[10px] font-semibold mt-0.5 ${isToday ? 'text-[#00A79D] font-bold' : 'text-slate-400'}`}>
                      {t.day}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center">
              <div className="text-center space-y-2">
                <BarChart3 className="w-8 h-8 text-slate-200 mx-auto" />
                <p className="text-xs text-slate-400">No traffic data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* 🍩 Content Distribution Donut Chart */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#002B49]">Content Mix</h2>
            <p className="text-[11px] text-slate-400 font-medium">Distribution of your website content</p>
          </div>

          <div className="flex items-center justify-center py-2">
            <DonutChart
              size={130}
              strokeWidth={20}
              segments={[
                { value: stats?.blogs.total ?? 0, color: '#FDB913', label: 'Blogs' },
                { value: stats?.services.total ?? 0, color: '#00A79D', label: 'Services' },
                { value: stats?.team.total ?? 0, color: '#3b82f6', label: 'Team' },
                { value: stats?.testimonials.total ?? 0, color: '#6366f1', label: 'Reviews' },
              ]}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Blogs', count: stats?.blogs.total ?? 0, color: '#FDB913' },
              { label: 'Services', count: stats?.services.total ?? 0, color: '#00A79D' },
              { label: 'Team', count: stats?.team.total ?? 0, color: '#3b82f6' },
              { label: 'Reviews', count: stats?.testimonials.total ?? 0, color: '#6366f1' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-600">{item.label}</span>
                <span className="font-bold text-slate-800 ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ ROW 3: Content Status Bars & Recent Activity ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 📊 Content Health */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#002B49]">Content Health</h2>
            <p className="text-[11px] text-slate-400 font-medium">Published vs total content status</p>
          </div>

          <div className="space-y-4">
            <ProgressBar
              label="Blog Posts"
              value={stats?.blogs.published ?? 0}
              max={stats?.blogs.total ?? 0}
              color="#FDB913"
            />
            <ProgressBar
              label="Services"
              value={stats?.services.published ?? 0}
              max={stats?.services.total ?? 0}
              color="#00A79D"
            />
            <ProgressBar
              label="Team Members"
              value={stats?.team.published ?? 0}
              max={stats?.team.total ?? 0}
              color="#3b82f6"
            />
            <ProgressBar
              label="Verified Reviews"
              value={stats?.testimonials.verified ?? 0}
              max={stats?.testimonials.total ?? 0}
              color="#6366f1"
            />
          </div>
        </div>

        {/* 📰 Recent Blog Posts */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#002B49]">Recent Blogs</h2>
              <p className="text-[11px] text-slate-400 font-medium">Latest published articles</p>
            </div>
            <Link href="/admin/blogs" className="text-[11px] font-bold text-[#00A79D] hover:underline flex items-center gap-0.5">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {(stats?.recentBlogs || []).length > 0 ? (
              stats!.recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/admin/blogs/${blog.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 truncate pr-3">{blog.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{formatTimeAgo(blog.createdAt)}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                    blog.status === 'PUBLISHED'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-slate-200/60 text-slate-500'
                  }`}>
                    {blog.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-6 text-center">
                <FileText className="w-6 h-6 text-slate-200 mx-auto mb-1" />
                <p className="text-xs text-slate-400">No blog posts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ⭐ Recent Testimonials */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#002B49]">Recent Reviews</h2>
              <p className="text-[11px] text-slate-400 font-medium">Latest client testimonials</p>
            </div>
            <Link href="/admin/testimonials" className="text-[11px] font-bold text-[#00A79D] hover:underline flex items-center gap-0.5">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {(stats?.recentTestimonials || []).length > 0 ? (
              stats!.recentTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#002B49] to-[#00A79D] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.company || 'Client'}</div>
                    </div>
                  </div>
                  {t.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <MessageSquare className="w-6 h-6 text-slate-200 mx-auto mb-1" />
                <p className="text-xs text-slate-400">No testimonials yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ ROW 4: Quick Actions ═══════════════ */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-[#002B49]">Quick Actions</h2>
            <p className="text-[11px] text-slate-400 font-medium">Jump to key admin tasks</p>
          </div>
          <Zap className="w-5 h-5 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { href: '/admin/blogs/new', label: 'New Blog', icon: PlusCircle, color: 'bg-[#002B49]' },
            { href: '/admin/services', label: 'Services', icon: Briefcase, color: 'bg-[#00A79D]' },
            { href: '/admin/team', label: 'Team', icon: Users, color: 'bg-blue-600' },
            { href: '/admin/testimonials', label: 'Reviews', icon: MessageSquare, color: 'bg-indigo-600' },
            { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, color: 'bg-rose-500' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[#002B49] bg-slate-50/50 hover:bg-white transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${action.color} text-white`}>
                  <action.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#002B49]">{action.label}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#002B49] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
