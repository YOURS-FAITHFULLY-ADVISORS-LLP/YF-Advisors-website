'use client';

import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Save, 
  Edit3,
  X,
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Share2, 
  Globe, 
  RefreshCw,
  Image as ImageIcon,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

export default function SettingsEditor() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    googleMapUrl: '',
    officeHours: '',
    logo: '',
    favicon: '',
    ogImage: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    defaultKeywords: '',
  });

  const [initialData, setInitialData] = useState<typeof formData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const s = data.data;
        const loaded = {
          companyName: s.companyName || '',
          companyEmail: s.companyEmail || '',
          companyPhone: s.companyPhone || '',
          companyAddress: s.companyAddress || '',
          googleMapUrl: s.googleMapUrl || '',
          officeHours: s.officeHours || '',
          logo: s.logo || '',
          favicon: s.favicon || '',
          ogImage: s.ogImage || '',
          facebookUrl: s.facebookUrl || '',
          instagramUrl: s.instagramUrl || '',
          linkedinUrl: s.linkedinUrl || '',
          twitterUrl: s.twitterUrl || '',
          youtubeUrl: s.youtubeUrl || '',
          defaultMetaTitle: s.defaultMetaTitle || '',
          defaultMetaDescription: s.defaultMetaDescription || '',
          defaultKeywords: s.defaultKeywords || '',
        };
        setFormData(loaded);
        setInitialData(loaded);
      } else {
        setErrorMessage(data.message || 'Failed to fetch global settings');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching global settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
    }
    setIsEditing(false);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Global settings updated successfully!');
        setInitialData(formData);
        setIsEditing(false);
      } else {
        setErrorMessage(data.message || data.errors?.[0] || 'Failed to update global settings.');
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
        <p className="text-xs text-slate-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  const inputClass = isEditing
    ? 'block w-full px-4 py-3 bg-white border border-[#002B49]/30 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all shadow-2xs'
    : 'block w-full px-4 py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-slate-800 text-sm font-medium cursor-default select-none shadow-2xs';

  const iconInputClass = isEditing
    ? 'block w-full pl-10 pr-4 py-3 bg-white border border-[#002B49]/30 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all shadow-2xs'
    : 'block w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-slate-800 text-sm font-medium cursor-default select-none shadow-2xs';

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight">
            Global Site Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage company contact details, branding assets, social channels, and SEO.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#002B49]/15 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#FDB913]" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#002B49]/15 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#FDB913]" />
              <span>Edit Settings</span>
            </button>
          )}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Company & Contact Information */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#002B49]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">Company Contact Information</h2>
            </div>
            {!isEditing && (
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Read Only
              </span>
            )}
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Company Name {isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="companyName"
                  required={isEditing}
                  disabled={!isEditing}
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="YF Advisors LLP"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Company Email {isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  required={isEditing}
                  disabled={!isEditing}
                  value={formData.companyEmail}
                  onChange={handleChange}
                  placeholder="info@yfadvisors.in"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Phone Number {isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="companyPhone"
                  required={isEditing}
                  disabled={!isEditing}
                  value={formData.companyPhone}
                  onChange={handleChange}
                  placeholder="+91 99999 99999"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Office Working Hours
                </label>
                <input
                  type="text"
                  name="officeHours"
                  disabled={!isEditing}
                  value={formData.officeHours}
                  onChange={handleChange}
                  placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Physical Office Address {isEditing && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name="companyAddress"
                rows={2}
                required={isEditing}
                disabled={!isEditing}
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="YF Advisors Office, New Delhi, India"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Google Maps Location Embed / URL
              </label>
              <input
                type="text"
                name="googleMapUrl"
                disabled={!isEditing}
                value={formData.googleMapUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className={`${inputClass} font-mono text-xs`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Branding & Assets */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#002B49]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">Branding Assets & Logos</h2>
            </div>
            {!isEditing && (
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Read Only
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Main Logo URL
              </label>
              <input
                type="text"
                name="logo"
                disabled={!isEditing}
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://.../logo.png"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Favicon URL
              </label>
              <input
                type="text"
                name="favicon"
                disabled={!isEditing}
                value={formData.favicon}
                onChange={handleChange}
                placeholder="https://.../favicon.ico"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                OG Social Image URL
              </label>
              <input
                type="text"
                name="ogImage"
                disabled={!isEditing}
                value={formData.ogImage}
                onChange={handleChange}
                placeholder="https://.../og-banner.jpg"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Social Media Channels */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#002B49]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">Social Media Handles</h2>
            </div>
            {!isEditing && (
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Read Only
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                  <Linkedin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="linkedinUrl"
                  disabled={!isEditing}
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://www.linkedin.com/company/yf-advisors"
                  className={iconInputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Facebook Page URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-700">
                  <Facebook className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="facebookUrl"
                  disabled={!isEditing}
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className={iconInputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Instagram URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-600">
                  <Instagram className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="instagramUrl"
                  disabled={!isEditing}
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className={iconInputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Twitter / X URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-700">
                  <Twitter className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="twitterUrl"
                  disabled={!isEditing}
                  value={formData.twitterUrl}
                  onChange={handleChange}
                  placeholder="https://x.com/..."
                  className={iconInputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Global SEO & Meta */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#002B49]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">Default Global SEO Settings</h2>
            </div>
            {!isEditing && (
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Read Only
              </span>
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Default Meta Title
              </label>
              <input
                type="text"
                name="defaultMetaTitle"
                disabled={!isEditing}
                value={formData.defaultMetaTitle}
                onChange={handleChange}
                placeholder="YF Advisors - Premier Financial Advisory Services"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Default Meta Description
              </label>
              <textarea
                name="defaultMetaDescription"
                rows={3}
                disabled={!isEditing}
                value={formData.defaultMetaDescription}
                onChange={handleChange}
                placeholder="Strategic financial advisory, compliance, tax, and process re-engineering."
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Default Keywords (Comma separated)
              </label>
              <input
                type="text"
                name="defaultKeywords"
                disabled={!isEditing}
                value={formData.defaultKeywords}
                onChange={handleChange}
                placeholder="financial advisory, manpower outsourcing, tax compliance, BPO"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-5 py-3 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-lg shadow-[#002B49]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#FDB913]" />
              <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
