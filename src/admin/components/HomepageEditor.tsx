'use client';

import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Type,
  Link2,
  FileText
} from 'lucide-react';

export default function HomepageEditor() {
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroDescription: '',
    heroButtonText: '',
    heroButtonLink: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHomepage = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/homepage');
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setFormData({
          heroTitle: data.data.heroTitle || '',
          heroDescription: data.data.heroDescription || '',
          heroButtonText: data.data.heroButtonText || '',
          heroButtonLink: data.data.heroButtonLink || '',
        });
      } else {
        setErrorMessage(data.message || 'Failed to load homepage settings');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching homepage settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepage();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Homepage Hero section updated successfully!');
        if (data.data) {
          setFormData({
            heroTitle: data.data.heroTitle || '',
            heroDescription: data.data.heroDescription || '',
            heroButtonText: data.data.heroButtonText || '',
            heroButtonLink: data.data.heroButtonLink || '',
          });
        }
      } else {
        setErrorMessage(data.message || data.errors?.[0] || 'Failed to update homepage settings');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight">
            Homepage / Hero Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Customize the main banner heading, subheadline, and CTA button.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchHomepage}
          disabled={loading || saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#002B49]' : ''}`} />
          <span>Reset Changes</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex-1">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Controls */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sparkles className="w-5 h-5 text-[#FDB913]" />
            <h2 className="text-base font-bold font-serif text-[#002B49]">Hero Content Settings</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Hero Title */}
            <div className="space-y-1.5">
              <label htmlFor="heroTitle" className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Hero Title <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-2xl shadow-2xs">
                <div className="absolute top-3.5 left-3.5 text-slate-400">
                  <Type className="w-4 h-4" />
                </div>
                <input
                  id="heroTitle"
                  name="heroTitle"
                  type="text"
                  required
                  value={formData.heroTitle}
                  onChange={handleChange}
                  placeholder="Grow your business not your Back Office"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Hero Description */}
            <div className="space-y-1.5">
              <label htmlFor="heroDescription" className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Subheadline / Description <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-2xl shadow-2xs">
                <div className="absolute top-3.5 left-3.5 text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  id="heroDescription"
                  name="heroDescription"
                  rows={4}
                  required
                  value={formData.heroDescription}
                  onChange={handleChange}
                  placeholder="Maximize efficiency with customized Global Business Services (GBS)..."
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Button Text & Button Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="heroButtonText" className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Button Label
                </label>
                <input
                  id="heroButtonText"
                  name="heroButtonText"
                  type="text"
                  value={formData.heroButtonText}
                  onChange={handleChange}
                  placeholder="Connect Now"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="heroButtonLink" className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Button Redirect Link
                </label>
                <div className="relative rounded-2xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    id="heroButtonLink"
                    name="heroButtonLink"
                    type="text"
                    value={formData.heroButtonLink}
                    onChange={handleChange}
                    placeholder="/#contact or https://wa.me/..."
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving || loading}
              className="w-full py-3.5 px-4 bg-[#002B49] hover:bg-[#00A79D] text-white font-bold text-sm tracking-wide rounded-2xl shadow-lg shadow-[#002B49]/20 focus:outline-none focus:ring-2 focus:ring-[#002B49] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Save className="w-4 h-4 text-[#FDB913]" />
              <span>{saving ? 'Saving Changes...' : 'Save Homepage Settings'}</span>
            </button>
          </form>
        </div>

        {/* Right: Live Preview Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
              Live Component Preview
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Hero Section
            </span>
          </div>

          <div className="bg-[#F5F7FA] border border-slate-200/80 rounded-2xl p-6 space-y-4 text-center relative overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif text-slate-900 leading-tight">
                {formData.heroTitle || 'Your Hero Heading Title Goes Here'}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                {formData.heroDescription || 'Your subheadline text will display here.'}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-[#002B49] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md">
                <span>{formData.heroButtonText || 'Connect Now'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FDB913]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
