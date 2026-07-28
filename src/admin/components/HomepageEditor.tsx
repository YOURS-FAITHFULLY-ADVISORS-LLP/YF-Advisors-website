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
  FileText,
  Layers,
  ShieldCheck
} from 'lucide-react';

export interface FeatureCardItem {
  id: string;
  title: string;
  subtitle: string;
}

export const DEFAULT_FEATURE_CARDS: FeatureCardItem[] = [
  { id: 'gst', title: 'GST Filing', subtitle: 'Compliant & On Time' },
  { id: 'compliance', title: 'Compliance', subtitle: 'Stay 100% Compliant' },
  { id: 'payroll', title: 'Payroll', subtitle: 'Accurate & Timely' },
  { id: 'roc', title: 'ROC Filing', subtitle: 'Hassle Free' },
  { id: 'bookkeeping', title: 'Bookkeeping', subtitle: 'Organized & Clean' },
  { id: 'cfo', title: 'Virtual CFO', subtitle: 'Insightful & Strategic' },
  { id: 'tax', title: 'Tax Filing', subtitle: 'Maximize Savings' },
];

export default function HomepageEditor() {
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroDescription: '',
    heroButtonText: '',
    heroButtonLink: '',
  });

  const [featureCards, setFeatureCards] = useState<FeatureCardItem[]>(DEFAULT_FEATURE_CARDS);
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

        if (data.data.heroCards) {
          try {
            const parsed = JSON.parse(data.data.heroCards);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Merge with defaults to ensure all 7 cards exist with valid ids
              const merged = DEFAULT_FEATURE_CARDS.map((def, idx) => {
                const found = parsed.find((p) => p.id === def.id) || parsed[idx];
                return {
                  id: def.id,
                  title: found?.title || def.title,
                  subtitle: found?.subtitle || def.subtitle,
                };
              });
              setFeatureCards(merged);
            }
          } catch (e) {
            console.error('Failed to parse heroCards JSON:', e);
          }
        }
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

  const handleCardChange = (index: number, field: 'title' | 'subtitle', value: string) => {
    setFeatureCards((prev) =>
      prev.map((card, idx) => (idx === index ? { ...card, [field]: value } : card))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload = {
      ...formData,
      heroCards: JSON.stringify(featureCards),
    };

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Homepage Hero section and 7 Feature Cards updated successfully!');
        if (data.data) {
          setFormData({
            heroTitle: data.data.heroTitle || '',
            heroDescription: data.data.heroDescription || '',
            heroButtonText: data.data.heroButtonText || '',
            heroButtonLink: data.data.heroButtonLink || '',
          });
          if (data.data.heroCards) {
            try {
              const parsed = JSON.parse(data.data.heroCards);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const merged = DEFAULT_FEATURE_CARDS.map((def, idx) => {
                  const found = parsed.find((p) => p.id === def.id) || parsed[idx];
                  return {
                    id: def.id,
                    title: found?.title || def.title,
                    subtitle: found?.subtitle || def.subtitle,
                  };
                });
                setFeatureCards(merged);
              }
            } catch (e) {}
          }
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
            Customize main banner text, CTA buttons, and the 7 orbiting ecosystem feature cards.
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Content Box */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Sparkles className="w-5 h-5 text-[#FDB913]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">1. Main Hero Content & CTA</h2>
            </div>

            <div className="space-y-5">
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
                    placeholder="Grow your business, not your Back Office."
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
                    rows={3}
                    required
                    value={formData.heroDescription}
                    onChange={handleChange}
                    placeholder="We deliver smart, reliable and technology-driven business solutions..."
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Button Text & Button Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="heroButtonText" className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                    CTA Button Label
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
                    CTA Redirect Link
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
                      placeholder="https://wa.me/..."
                      className="block w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7 Orbiting Feature Cards Manager Box */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Layers className="w-5 h-5 text-[#00A79D]" />
              <div>
                <h2 className="text-base font-bold font-serif text-[#002B49]">
                  2. Orbiting Ecosystem Badges (7 Floating Cards)
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Edit the titles and sub-taglines for the 7 feature badges around the hero graphic.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {featureCards.map((card, index) => (
                <div
                  key={card.id || index}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#002B49] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#002B49] text-white text-[10px] flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <span>Badge {index + 1} ({card.id.toUpperCase()})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Title
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                        placeholder="e.g. GST Filing"
                        className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]/20 focus:border-[#002B49] transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={card.subtitle}
                        onChange={(e) => handleCardChange(index, 'subtitle', e.target.value)}
                        placeholder="e.g. Compliant & On Time"
                        className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]/20 focus:border-[#002B49] transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || loading}
            className="w-full py-4 px-6 bg-[#002B49] hover:bg-[#00A79D] text-white font-bold text-sm tracking-wide rounded-2xl shadow-lg shadow-[#002B49]/20 focus:outline-none focus:ring-2 focus:ring-[#002B49] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4.5 h-4.5 text-[#FDB913]" />
            <span>{saving ? 'Saving Homepage Settings...' : 'Save Homepage Settings'}</span>
          </button>
        </div>

        {/* Right: Live Preview Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
              Live Component Preview
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#00A79D] border border-teal-500/20">
              Hero + 7 Feature Cards
            </span>
          </div>

          <div className="bg-[#F5F7FA] border border-slate-200/80 rounded-2xl p-5 space-y-5 relative overflow-hidden">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold font-serif text-slate-900 leading-tight">
                {formData.heroTitle || 'Your Hero Heading Title'}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                {formData.heroDescription || 'Your subheadline description text...'}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-[#002B49] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md">
                <span>{formData.heroButtonText || 'Connect Now'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FDB913]" />
              </div>
            </div>

            {/* 7 Orbiting Badges Live Preview */}
            <div className="pt-3 border-t border-slate-200/70 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Orbiting Feature Badges Preview (7 Badges)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {featureCards.map((card, i) => (
                  <div
                    key={card.id || i}
                    className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#00A79D] flex items-center justify-center shrink-0 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                        {card.title || 'Badge Title'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold truncate">
                        {card.subtitle || 'Subtitle'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
