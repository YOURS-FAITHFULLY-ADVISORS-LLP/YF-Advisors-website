'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Users,
  Linkedin,
  Award,
  Image as ImageIcon,
  RefreshCw,
  FileText
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';

interface TeamEditorProps {
  memberId?: string;
}

const extractLinkedinUsername = (url?: string) => {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
};

export default function TeamEditor({ memberId }: TeamEditorProps) {
  const router = useRouter();
  const isNew = !memberId;

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    profileImage: '',
    bio: '',
    experience: '',
    linkedinUrl: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    displayOrder: 0,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMember = async () => {
    if (!memberId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/team/${memberId}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const m = data.data;
        setFormData({
          name: m.name || '',
          designation: m.designation || '',
          profileImage: m.profileImage || '',
          bio: m.bio || '',
          experience: m.experience || '',
          linkedinUrl: m.linkedinUrl || '',
          status: m.status || 'PUBLISHED',
          displayOrder: m.displayOrder ?? 0,
        });
      } else {
        setErrorMessage(data.message || 'Failed to fetch team member details');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching team member.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew) {
      fetchMember();
    }
  }, [memberId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'displayOrder' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const url = isNew ? '/api/admin/team' : `/api/admin/team/${memberId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isNew ? 'Team member created successfully!' : 'Team member updated successfully!'
        );
        if (isNew && data.data?.id) {
          setTimeout(() => {
            router.push(`/admin/team/${data.data.id}`);
          }, 1000);
        }
      } else {
        setErrorMessage(data.message || data.errors?.[0] || 'Failed to save team member.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#002B49] animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading team member details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link
            href="/admin/team"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
            title="Back to team list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight truncate">
              {isNew ? 'Add Team Member' : 'Edit Team Member'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
              {isNew
                ? 'Add a new partner or executive profile.'
                : `Editing: ${formData.name || 'Team Member'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <Link
            href="/admin/team"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#002B49]/15 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#FDB913]" />
            <span>{saving ? 'Saving...' : isNew ? 'Add Member' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Users className="w-5 h-5 text-[#002B49]" />
          <h2 className="text-base font-bold font-serif text-[#002B49]">Profile Information</h2>
        </div>

        <div className="space-y-5">
          {/* Name & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Vishal Aggarwal"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Designation / Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="designation"
                required
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Founder and Partner"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Profile Image & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImageUploadInput
              label="Profile Image"
              value={formData.profileImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
              folder="team"
              placeholder="https://.../vishal.png"
              required={true}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Experience Badge
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Experience: 14+ years"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* LinkedIn Profile Prefix & Username, Display Order & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                LinkedIn Profile Username
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden focus-within:ring-2 focus-within:ring-[#002B49]/30 focus-within:border-[#002B49] focus-within:bg-white transition-all">
                <span className="px-3 py-3 text-[11px] font-bold text-slate-500 bg-slate-100/90 border-r border-slate-200 select-none shrink-0">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  name="linkedinUrl"
                  value={extractLinkedinUsername(formData.linkedinUrl)}
                  onChange={(e) => {
                    const rawVal = e.target.value;
                    const cleanUsername = rawVal.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/+$/, '');
                    setFormData((prev) => ({
                      ...prev,
                      linkedinUrl: cleanUsername ? `https://www.linkedin.com/in/${cleanUsername}/` : '',
                    }));
                  }}
                  placeholder="username"
                  className="w-full px-3 py-3 text-slate-900 text-xs font-bold bg-transparent focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                placeholder="0"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all cursor-pointer"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          {/* Bio Summary */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
              Bio & Specialization Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              rows={4}
              required
              value={formData.bio}
              onChange={handleChange}
              placeholder="e.g. Chartered Accountant. Specialization: Business Process Re-engineering & Advisory."
              className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/team"
            className="px-5 py-3 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-lg shadow-[#002B49]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#FDB913]" />
            <span>{saving ? 'Saving...' : isNew ? 'Add Team Member' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
