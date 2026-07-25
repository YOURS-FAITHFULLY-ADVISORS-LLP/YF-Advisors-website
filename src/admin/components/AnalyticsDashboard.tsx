'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Users, 
  UserCheck, 
  Activity, 
  Eye, 
  Clock, 
  TrendingDown, 
  Globe, 
  Smartphone, 
  Monitor, 
  Compass, 
  ArrowUpRight, 
  RefreshCw, 
  Filter, 
  Search, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  MousePointer,
  CheckCircle,
  PhoneCall,
  Mail,
  MessageSquare,
  BarChart3,
  Inbox
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalVisitors: number;
    uniqueVisitors: number;
    activeVisitors: number;
    totalPageViews: number;
    avgSession: string;
    bounceRate: string;
  };
  visitorTrends: { day: string; count: number }[];
  countries: { country: string; count: number }[];
  cities: { city: string; count: number }[];
  devices: { name: string; count: number; percentage: number }[];
  browsers: { name: string; count: number }[];
  operatingSystems: { name: string; count: number }[];
  mostVisitedPages: { rank: number; page: string; views: number; avgTimeSpent: string }[];
  recentVisitors: {
    visitorId: string;
    exitPage: string;
    device: string;
    browser: string;
    country: string;
    city: string;
    lastVisit: string;
    status: string;
  }[];
  recentActivity: { visitorId: string; action: string; page: string; time: string }[];
  buttonAnalytics: { button: string; clicks: number }[];
}

interface VisitorProfile {
  visitorId: string;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  screenResolution: string;
  language: string;
  timezone: string;
  referrer: string;
  landingPage: string;
  exitPage: string;
  firstVisit: string;
  lastVisit: string;
  visitCount: number;
  sessionDuration: string;
  pagesVisitedCount: number;
  onlineStatus: string;
  journey: string[];
}

// Empty state component for sections with no data
function EmptyState({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon className="w-8 h-8 text-slate-300 mb-2" />
      <p className="text-xs text-slate-400 font-medium">{label}</p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');

  // Selected Visitor Modal
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // View All Visitors Modal State
  const [showAllVisitorsModal, setShowAllVisitorsModal] = useState(false);
  const [allVisitors, setAllVisitors] = useState<any[]>([]);
  const [loadingAllVisitors, setLoadingAllVisitors] = useState(false);
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorStatusFilter, setVisitorStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [visitorPage, setVisitorPage] = useState(1);
  const [visitorPaginationMeta, setVisitorPaginationMeta] = useState<any>(null);

  const fetchAllVisitors = useCallback(async () => {
    setLoadingAllVisitors(true);
    try {
      let url = `/api/admin/analytics/visitors?page=${visitorPage}&limit=10`;
      if (visitorSearch.trim()) {
        url += `&search=${encodeURIComponent(visitorSearch.trim())}`;
      }
      if (visitorStatusFilter === 'online') {
        url += `&online=true`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.success) {
        let list = json.data || [];
        if (visitorStatusFilter === 'offline') {
          list = list.filter((v: any) => v.status === 'Offline');
        }
        setAllVisitors(list);
        if (json.pagination) {
          setVisitorPaginationMeta(json.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching all visitors:', err);
    } finally {
      setLoadingAllVisitors(false);
    }
  }, [visitorPage, visitorSearch, visitorStatusFilter]);

  useEffect(() => {
    if (showAllVisitorsModal) {
      fetchAllVisitors();
    }
  }, [showAllVisitorsModal, fetchAllVisitors]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/dashboard?range=${range}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboard();
    // Auto-refresh analytics data every 2 minutes (120,000 ms) for live updates
    const interval = setInterval(() => {
      fetchDashboard();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const openVisitorProfile = async (vId: string) => {
    setSelectedVisitorId(vId);
    setLoadingProfile(true);
    try {
      const res = await fetch(`/api/admin/analytics/visitor/${vId}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setVisitorProfile(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#002B49] animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Analytics Dashboard...</p>
      </div>
    );
  }

  const overview = data?.overview || {
    totalVisitors: 0,
    uniqueVisitors: 0,
    activeVisitors: 0,
    totalPageViews: 0,
    avgSession: '0m 0s',
    bounceRate: '0%',
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002B49] tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time, privacy-friendly visitor analytics — only real data from your website.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-2xl shadow-2xs">
            {['today', '7d', '30d', '12m'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  range === r ? 'bg-[#002B49] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '12 Months'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchDashboard}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 📊 Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Visitors</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#002B49]">{overview.totalVisitors.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unique Visitors</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#002B49]">{overview.uniqueVisitors.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Visitors</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{overview.activeVisitors}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#002B49]">{overview.totalPageViews.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Session</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#002B49]">{overview.avgSession}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bounce Rate</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#002B49]">{overview.bounceRate}</div>
        </div>
      </div>

      {/* 📈 Visitor Trend & Most Visited Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Bar Chart - REAL DATA */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#002B49]">Visitor Trends</h2>
              <p className="text-xs text-slate-400">
                {range === 'today' ? 'Hourly traffic today' : range === '12m' ? 'Monthly traffic volume' : 'Daily website traffic volume'}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              {range.toUpperCase()}
            </span>
          </div>

          {data?.visitorTrends && data.visitorTrends.length > 0 && data.visitorTrends.some(t => t.count > 0) ? (
            <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100">
              {data.visitorTrends.map((t, idx) => {
                const max = Math.max(...data.visitorTrends.map(d => d.count), 1);
                const heightPercent = Math.min(100, Math.round((t.count / max) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.count}
                    </span>
                    <div
                      style={{ height: `${Math.max(heightPercent, t.count > 0 ? 4 : 0)}%` }}
                      className="w-full bg-[#002B49] group-hover:bg-[#00A79D] rounded-t-xl transition-all duration-300 shadow-2xs"
                    />
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 truncate w-full text-center">{t.day}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={BarChart3} label="No visitor data yet. Trends will appear once visitors start browsing your website." />
          )}
        </div>

        {/* 📄 Most Visited Pages */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#002B49]">Most Visited Pages</h2>
            <p className="text-xs text-slate-400">Top performing pages by views</p>
          </div>

          {data?.mostVisitedPages && data.mostVisitedPages.length > 0 ? (
            <div className="space-y-3">
              {data.mostVisitedPages.map((p) => (
                <div key={p.rank} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#002B49]/10 text-[#002B49] font-bold text-[11px] flex items-center justify-center shrink-0">
                      {p.rank}
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[130px]">{p.page}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#002B49]">{p.views.toLocaleString()} views</div>
                    <div className="text-[10px] text-slate-400">{p.avgTimeSpent} avg</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Eye} label="No page views recorded yet." />
          )}
        </div>
      </div>

      {/* 👥 Recent Visitors & 🔘 Button Clicks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#002B49]">Recent Visitors</h2>
                <p className="text-xs text-slate-400">Anonymous visitor sessions (No personal data collected)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-bold text-[#00A79D]">Anonymous IDs</span>
                <button
                  onClick={() => setShowAllVisitorsModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#002B49] text-white hover:bg-[#002B49]/90 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {data?.recentVisitors && data.recentVisitors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap">Visitor ID</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap">Last Page</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap">Location</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap">Device</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {data.recentVisitors.map((v) => (
                      <tr key={v.visitorId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5 font-bold text-[#002B49] whitespace-nowrap">{v.visitorId}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5 text-slate-700 font-medium max-w-[140px] truncate" title={v.exitPage}>{v.exitPage}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5 text-slate-500 whitespace-nowrap">{v.city}, {v.country}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5 text-slate-500 whitespace-nowrap">{v.device} ({v.browser})</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            v.status === 'Online' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200/60 text-slate-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {v.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => openVisitorProfile(v.visitorId)}
                            className="px-3 py-1.5 rounded-xl bg-[#002B49]/10 text-[#002B49] hover:bg-[#002B49] hover:text-white font-bold text-[11px] transition-colors shrink-0"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon={Users} label="No visitors recorded yet. Data will appear once real users visit your website." />
            )}
          </div>
        </div>

        {/* 🔘 Button Click Analytics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#002B49]">Button Click Analytics</h2>
            <p className="text-xs text-slate-400">Tracked Call-To-Action clicks</p>
          </div>

          {data?.buttonAnalytics && data.buttonAnalytics.length > 0 ? (
            <div className="space-y-3">
              {data.buttonAnalytics.map((b, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <MousePointer className="w-3.5 h-3.5 text-[#00A79D]" />
                    <span className="font-semibold text-slate-800">{b.button}</span>
                  </div>
                  <span className="font-bold text-[#002B49] bg-[#002B49]/10 px-2.5 py-1 rounded-lg">
                    {b.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={MousePointer} label="No CTA clicks tracked yet." />
          )}
        </div>
      </div>

      {/* 🌍 Countries, Cities, Devices, Browsers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Countries</h3>
          {data?.countries && data.countries.length > 0 ? (
            <div className="space-y-2">
              {data.countries.map((c, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{c.country}</span>
                  <span className="font-bold text-[#002B49]">{c.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No data yet</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Cities</h3>
          {data?.cities && data.cities.length > 0 ? (
            <div className="space-y-2">
              {data.cities.map((c, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{c.city}</span>
                  <span className="font-bold text-[#002B49]">{c.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No data yet</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Devices</h3>
          {data?.devices && data.devices.length > 0 ? (
            <div className="space-y-2">
              {data.devices.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{d.name}</span>
                  <span className="font-bold text-[#002B49]">{d.percentage}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No data yet</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Browsers / OS</h3>
          {data?.browsers && data.browsers.length > 0 ? (
            <div className="space-y-2">
              {data.browsers.map((b, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{b.name}</span>
                  <span className="font-bold text-[#002B49]">{b.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No data yet</p>
          )}
        </div>
      </div>

      {/* 🔍 Visitor Profile Modal */}
      {selectedVisitorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#002B49] text-white font-bold text-sm">
                  {selectedVisitorId}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#002B49]">Visitor Insights Profile</h2>
                  <p className="text-xs text-slate-400">Detailed Journey & Technical Environment</p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedVisitorId(null); setVisitorProfile(null); }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 text-xs">
              {loadingProfile ? (
                <div className="py-12 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-[#002B49] animate-spin mx-auto" />
                  <p className="text-slate-400 font-medium">Fetching visitor details...</p>
                </div>
              ) : visitorProfile ? (
                <>
                  {/* Technical & Location Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Visitor ID</div>
                      <div className="font-bold text-slate-900 mt-0.5">{visitorProfile.visitorId}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Location</div>
                      <div className="font-bold text-slate-900 mt-0.5">{visitorProfile.city}, {visitorProfile.country}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Device & OS</div>
                      <div className="font-bold text-slate-900 mt-0.5">{visitorProfile.device} / {visitorProfile.os}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Browser</div>
                      <div className="font-bold text-slate-900 mt-0.5">{visitorProfile.browser}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Resolution</div>
                      <div className="font-bold text-slate-900 mt-0.5">{visitorProfile.screenResolution}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Status</div>
                      <div className={`font-bold mt-0.5 ${visitorProfile.onlineStatus === 'Online' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {visitorProfile.onlineStatus}
                      </div>
                    </div>
                  </div>

                  {/* 🧭 Visitor Journey Flow */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-bold text-[#002B49] uppercase tracking-wider text-[11px]">🧭 Visitor Journey Flow</h3>
                    {visitorProfile.journey.length > 0 ? (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-2">
                        {visitorProfile.journey.map((step, idx) => (
                          <React.Fragment key={idx}>
                            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
                              {step}
                            </span>
                            {idx < visitorProfile.journey.length - 1 && (
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                        <span className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-600 font-semibold">
                          Exit Website
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-3 text-center">No journey data available.</p>
                    )}
                  </div>
                </>
              ) : null}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => { setSelectedVisitorId(null); setVisitorProfile(null); }}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🌐 All Visitors Modal */}
      {showAllVisitorsModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#002B49] text-white font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#002B49]">All Visitor Sessions</h2>
                  <p className="text-xs text-slate-400">Complete privacy-friendly live traffic & session analytics</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllVisitorsModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Controls */}
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Visitor ID, location, or page..."
                  value={visitorSearch}
                  onChange={(e) => {
                    setVisitorSearch(e.target.value);
                    setVisitorPage(1);
                  }}
                  className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#002B49] transition-colors"
                />
                {visitorSearch && (
                  <button
                    onClick={() => { setVisitorSearch(''); setVisitorPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => { setVisitorStatusFilter('all'); setVisitorPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    visitorStatusFilter === 'all' ? 'bg-white text-[#002B49] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => { setVisitorStatusFilter('online'); setVisitorPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    visitorStatusFilter === 'online' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Online Only
                </button>
                <button
                  onClick={() => { setVisitorStatusFilter('offline'); setVisitorPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    visitorStatusFilter === 'offline' ? 'bg-white text-slate-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>

            {/* Visitors Table Content */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {loadingAllVisitors ? (
                <div className="py-16 text-center space-y-2">
                  <RefreshCw className="w-7 h-7 text-[#002B49] animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Fetching visitors list...</p>
                </div>
              ) : allVisitors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-50">
                        <th className="px-6 py-3.5 whitespace-nowrap">Visitor ID</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Last Visited Page</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Location</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Device / Browser</th>
                        <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3.5 whitespace-nowrap text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {allVisitors.map((v: any) => (
                        <tr key={v.visitorId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-[#002B49] whitespace-nowrap">{v.visitorId}</td>
                          <td className="px-6 py-3.5 text-slate-700 font-medium max-w-[200px] truncate" title={v.exitPage}>{v.exitPage}</td>
                          <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{v.city || 'Unknown'}, {v.country || 'Unknown'}</td>
                          <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{v.device} ({v.browser})</td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              v.status === 'Online' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200/60 text-slate-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              {v.status}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => openVisitorProfile(v.visitorId)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#002B49]/10 text-[#002B49] hover:bg-[#002B49] hover:text-white font-bold text-[11px] transition-colors shrink-0"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState icon={Users} label="No matching visitors found." />
              )}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <div className="text-slate-500 font-medium">
                {visitorPaginationMeta ? (
                  <>Showing <span className="font-bold text-slate-800">{((visitorPage - 1) * visitorPaginationMeta.limit) + 1}</span> to <span className="font-bold text-slate-800">{Math.min(visitorPage * visitorPaginationMeta.limit, visitorPaginationMeta.total)}</span> of <span className="font-bold text-slate-800">{visitorPaginationMeta.total}</span> visitors</>
                ) : (
                  <span>Visitors count: {allVisitors.length}</span>
                )}
              </div>

              {visitorPaginationMeta && visitorPaginationMeta.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={visitorPage <= 1}
                    onClick={() => setVisitorPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-700 px-2">
                    Page {visitorPage} of {visitorPaginationMeta.totalPages}
                  </span>
                  <button
                    disabled={visitorPage >= visitorPaginationMeta.totalPages}
                    onClick={() => setVisitorPage((p) => p + 1)}
                    className="p-1.5 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
