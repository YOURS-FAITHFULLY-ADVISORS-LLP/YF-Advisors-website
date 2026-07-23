'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Star,
  ShieldCheck,
  RefreshCw,
  User
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';

interface TestimonialEditorProps {
  testimonialId?: string;
}

export default function TestimonialEditor({ testimonialId }: TestimonialEditorProps) {
  const router = useRouter();
  const isNew = !testimonialId;

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    company: '',
    profileImage: '',
    initials: '',
    review: '',
    rating: 5,
    isVerified: true,
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    displayOrder: 0,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getInitials = (name: string) => {
    if (!name.trim()) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const fetchTestimonial = async () => {
    if (!testimonialId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonialId}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const t = data.data;
        setFormData({
          name: t.name || '',
          designation: t.designation || '',
          company: t.company || '',
          profileImage: t.profileImage || '',
          initials: t.initials || '',
          review: t.review || '',
          rating: t.rating ?? 5,
          isVerified: t.isVerified ?? true,
          status: t.status || 'PUBLISHED',
          displayOrder: t.displayOrder ?? 0,
        });
      } else {
        setErrorMessage(data.message || 'Failed to fetch testimonial details');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching testimonial.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      initials: isNew ? getInitials(name) : prev.initials,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'rating' || name === 'displayOrder' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload = {
      ...formData,
      initials: formData.initials || getInitials(formData.name),
    };

    try {
      const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${testimonialId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isNew ? 'Testimonial created successfully!' : 'Testimonial updated successfully!'
        );
        if (isNew && data.data?.id) {
          setTimeout(() => {
            router.push(`/admin/testimonials/${data.data.id}`);
          }, 1000);
        }
      } else {
        setErrorMessage(data.message || data.errors?.[0] || 'Failed to save testimonial.');
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
        <p className="text-xs text-slate-500 font-medium">Loading testimonial details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/testimonials"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Back to testimonials list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight">
              {isNew ? 'Add Testimonial' : 'Edit Testimonial'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {isNew
                ? 'Create a new client review or feedback card.'
                : `Editing: ${formData.name || 'Testimonial'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/testimonials"
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
            <span>{saving ? 'Saving...' : isNew ? 'Add Testimonial' : 'Save Changes'}</span>
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
          <MessageSquare className="w-5 h-5 text-[#002B49]" />
          <h2 className="text-base font-bold font-serif text-[#002B49]">Client Review Details</h2>
        </div>

        <div className="space-y-5">
          {/* Name & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Jaz Dhami"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Designation / Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="designation"
                required
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. UK or Salesforce Consultant, Wipro"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Company & Initials & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Company (Optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Wipro or Bloomberg US"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Avatar Initials
              </label>
              <input
                type="text"
                name="initials"
                value={formData.initials}
                onChange={handleChange}
                placeholder="e.g. JD"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 uppercase font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Star Rating (1-5)
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all cursor-pointer"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
            </div>
          </div>

          {/* Profile Image & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImageUploadInput
              label="Profile Image"
              value={formData.profileImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
              folder="testimonials"
              placeholder="https://.../avatar.jpg"
            />

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
          </div>

          {/* Status & Verified Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Publish Status
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

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="isVerified"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-slate-300 text-[#002B49] focus:ring-[#002B49] cursor-pointer"
              />
              <label htmlFor="isVerified" className="text-xs font-bold text-[#002B49] cursor-pointer flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark as Verified Client Review</span>
              </label>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
              Client Review Quote <span className="text-red-500">*</span>
            </label>
            <textarea
              name="review"
              rows={4}
              required
              value={formData.review}
              onChange={handleChange}
              placeholder="Prompt, helpful, knowledgeable and informative! Vishal and the team were great..."
              className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/testimonials"
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
            <span>{saving ? 'Saving...' : isNew ? 'Add Testimonial' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
