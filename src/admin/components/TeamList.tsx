'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Linkedin, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Award
} from 'lucide-react';

export interface TeamMemberItem {
  id: string;
  name: string;
  designation: string;
  profileImage?: string | null;
  bio: string;
  experience?: string | null;
  linkedinUrl?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function TeamList() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
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

  const fetchTeamMembers = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '10');
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/team?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTeamMembers(data.data || []);
        if (data.meta) {
          setTotalPages(data.meta.totalPages || 1);
          setTotalCount(data.meta.total || 0);
        }
      } else {
        setErrorMessage(data.message || 'Failed to fetch team members list');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTeamMembers();
  };

  const handleToggleStatus = async (member: TeamMemberItem) => {
    const newStatus = member.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setTogglingId(member.id);
    setActionSuccess(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/team/${member.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess(`Status for "${member.name}" changed to ${newStatus}`);
        setTeamMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m))
        );
      } else {
        setErrorMessage(data.message || 'Failed to update team member status');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error toggling status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete team member "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    setActionSuccess(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActionSuccess('Team member deleted successfully');
        setTeamMembers((prev) => prev.filter((m) => m.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      } else {
        setErrorMessage(data.message || 'Failed to delete team member');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error deleting team member');
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
            Team Members
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage partners, founders, and key leadership team profiles.
          </p>
        </div>

        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#002B49]/15 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FDB913]" />
          <span>Add Team Member</span>
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
            placeholder="Search by name, designation, specialization..."
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
            onClick={fetchTeamMembers}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#002B49]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Team Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#002B49] animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No team members found</p>
            <p className="text-xs text-slate-400">Try adjusting your search filter or add a new team member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-[#002B49] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Member</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Name & Avatar */}
                    <td className="py-4 px-6 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-3.5">
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.name}
                            className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-2xl bg-[#002B49]/10 border border-[#002B49]/20 text-[#002B49] flex items-center justify-center font-bold text-sm shrink-0">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/team/${member.id}`}
                            className="font-bold text-slate-900 hover:text-[#002B49] line-clamp-1 text-sm font-serif"
                          >
                            {member.name}
                          </Link>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 text-xs">
                        {member.designation}
                      </span>
                    </td>

                    {/* Experience Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <Award className="w-3 h-3 text-[#FDB913]" />
                        {member.experience || 'Experienced'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(member)}
                        disabled={togglingId === member.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                          member.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {togglingId === member.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : member.status === 'PUBLISHED' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{member.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/team/${member.id}`}
                          className="p-2 rounded-xl text-[#002B49] hover:bg-slate-100 transition-colors"
                          title="Edit Team Member"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          disabled={deletingId === member.id}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          {deletingId === member.id ? (
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
        {!loading && teamMembers.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              Showing page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({totalCount} total members)
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
