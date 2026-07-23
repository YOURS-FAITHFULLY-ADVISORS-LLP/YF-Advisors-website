'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  ShieldCheck,
  Quote
} from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  designation: string;
  company?: string | null;
  profileImage?: string | null;
  initials?: string | null;
  review: string;
  rating: number;
  isVerified: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '10');
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/testimonials?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTestimonials(data.data || []);
        if (data.meta) {
          setTotalPages(data.meta.totalPages || 1);
          setTotalCount(data.meta.total || 0);
        }
      } else {
        setErrorMessage(data.message || 'Failed to fetch testimonials list');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTestimonials();
  };

  const handleToggleStatus = async (item: TestimonialItem) => {
    const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setTogglingId(item.id);
    setActionSuccess(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess(`Status for "${item.name}" changed to ${newStatus}`);
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, status: newStatus } : t))
        );
      } else {
        setErrorMessage(data.message || 'Failed to update testimonial status');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error toggling status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete testimonial from "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    setActionSuccess(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess('Testimonial deleted successfully');
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      } else {
        setErrorMessage(data.message || 'Failed to delete testimonial');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error deleting testimonial');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight">
            Client Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage client reviews, star ratings, and verification badges.
          </p>
        </div>

        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#002B49]/15 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FDB913]" />
          <span>Add Testimonial</span>
        </Link>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1">{actionSuccess}</div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, designation, review..."
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B49]/20 focus:border-[#002B49] focus:bg-white transition-all"
          />
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-semibold text-[#002B49] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <button
            onClick={fetchTestimonials}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#002B49]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#002B49] animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No testimonials found</p>
            <p className="text-xs text-slate-400">Try adjusting your search filter or add a new testimonial.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-[#002B49] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Review Quote</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {testimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Client Avatar & Name */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {item.profileImage ? (
                          <img
                            src={item.profileImage}
                            alt={item.name}
                            className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#002B49] flex items-center justify-center font-bold text-xs shrink-0">
                            {item.initials || item.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/admin/testimonials/${item.id}`}
                              className="font-bold text-slate-900 hover:text-[#002B49] text-sm font-serif"
                            >
                              {item.name}
                            </Link>
                            {item.isVerified && (
                              <span title="Verified Client">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {item.designation} {item.company ? `• ${item.company}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Review Quote */}
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-start gap-1.5">
                        <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-slate-700 line-clamp-2 italic font-medium">
                          &ldquo;{item.review}&rdquo;
                        </p>
                      </div>
                    </td>

                    {/* Rating Stars */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < item.rating
                                ? 'text-[#FDB913] fill-[#FDB913]'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={togglingId === item.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {togglingId === item.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : item.status === 'PUBLISHED' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{item.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/testimonials/${item.id}`}
                          className="p-2 rounded-xl text-[#002B49] hover:bg-slate-100 transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Testimonial"
                        >
                          {deletingId === item.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && testimonials.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              Showing page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({totalCount} total reviews)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
