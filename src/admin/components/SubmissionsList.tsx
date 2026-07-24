'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  RefreshCw, 
  Mail, 
  Phone, 
  User, 
  Briefcase, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  FileText
} from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string | null;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
  ipAddress: string | null;
  notes: string | null;
  createdAt: string;
}

const STATUS_BADGES = {
  NEW: { label: 'New', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  RESOLVED: { label: 'Resolved', bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  ARCHIVED: { label: 'Archived', bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
};

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Submission Modal
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/contact-submissions?${query}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmissions(data.data || []);
        if (data.meta) {
          setTotalPages(data.meta.totalPages || 1);
          setTotalCount(data.meta.total || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess('Status updated successfully!');
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission(data.data);
        }
        fetchSubmissions();
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error updating status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotes }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess('Notes saved successfully!');
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission(data.data);
        }
        fetchSubmissions();
        setTimeout(() => setActionSuccess(null), 3000);
      } else {
        setActionError(data.message || 'Failed to save notes');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error saving notes');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission inquiry?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
        setActionSuccess('Submission deleted.');
        fetchSubmissions();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const openDetailsModal = (sub: Submission) => {
    setSelectedSubmission(sub);
    setEditingNotes(sub.notes || '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#002B49] tracking-tight">Form Inquiries</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and manage messages submitted by clients through the Contact form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#002B49]/10 text-[#002B49]">
            Total: {totalCount}
          </span>
          <button
            onClick={fetchSubmissions}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, service, or message content..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] focus:ring-1 focus:ring-[#00A79D] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-40 px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D] bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Submissions Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#002B49] animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading form inquiries...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No inquiries found</p>
            <p className="text-xs text-slate-400">There are no submission records matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Message Snippet</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {submissions.map((sub) => {
                  const badge = STATUS_BADGES[sub.status] || STATUS_BADGES.NEW;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{sub.name}</div>
                        <div className="text-[11px] text-slate-500">{sub.email}</div>
                        <div className="text-[11px] text-slate-400">{sub.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#00A79D]/10 text-[#00A79D] font-bold text-[11px]">
                          {sub.service}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                        {sub.message || <span className="text-slate-300 italic">No message provided</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full border text-[10px] font-bold ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailsModal(sub)}
                            className="p-2 rounded-xl text-slate-600 hover:bg-[#002B49]/10 hover:text-[#002B49] transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            disabled={deletingId === sub.id}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#002B49] text-white">
                  <Mail className="w-5 h-5 text-[#FDB913]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#002B49]">Inquiry Details</h2>
                  <p className="text-xs text-slate-400">Received on {new Date(selectedSubmission.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </div>
                  <div className="text-sm font-bold text-slate-900">{selectedSubmission.name}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <Briefcase className="w-3.5 h-3.5" /> Requested Service
                  </div>
                  <div className="text-sm font-bold text-[#00A79D]">{selectedSubmission.service}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </div>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-sm font-medium text-slate-900 hover:text-[#00A79D] underline underline-offset-2">
                    {selectedSubmission.email}
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </div>
                  <a href={`tel:${selectedSubmission.phone}`} className="text-sm font-medium text-slate-900 hover:text-[#00A79D] underline underline-offset-2">
                    {selectedSubmission.phone}
                  </a>
                </div>
              </div>

              {/* Full Message */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Submitted Message
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message || <span className="text-slate-400 italic">No message provided.</span>}
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Update Submission Status:
                  </label>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value)}
                    disabled={updatingStatus}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#00A79D]"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Admin Notes / Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Add internal notes regarding follow-ups..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#00A79D]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveNotes(selectedSubmission.id)}
                      disabled={updatingStatus}
                      className="px-4 py-2 rounded-xl bg-[#002B49] text-white text-xs font-bold hover:bg-[#002B49]/90 transition-colors disabled:opacity-50"
                    >
                      Save Internal Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
