'use client';

import React, { useEffect, useState } from 'react';
import { 
  Info, 
  Save, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Award,
  Users,
  Lightbulb,
  Target,
  BarChart2,
  Globe,
  Shield,
  TrendingUp
} from 'lucide-react';

interface PointItem {
  id?: string;
  title: string;
  order: number;
}

interface StatisticItem {
  id?: string;
  title: string;
  value: string;
  icon: string;
  order: number;
}

export default function AboutEditor() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    whoWeAreTitle: '',
    whoWeAreContent: '',
    whyChooseTitle: '',
    whyChooseContent: '',
  });

  const [visionPoints, setVisionPoints] = useState<PointItem[]>([]);
  const [missionPoints, setMissionPoints] = useState<PointItem[]>([]);
  const [statistics, setStatistics] = useState<StatisticItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAboutSettings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/about');
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const ab = data.data;
        setFormData({
          title: ab.title || '',
          subtitle: ab.subtitle || '',
          whoWeAreTitle: ab.whoWeAreTitle || '',
          whoWeAreContent: ab.whoWeAreContent || '',
          whyChooseTitle: ab.whyChooseTitle || '',
          whyChooseContent: ab.whyChooseContent || '',
        });

        if (Array.isArray(ab.visionPoints)) {
          setVisionPoints(ab.visionPoints.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
        }
        if (Array.isArray(ab.missionPoints)) {
          setMissionPoints(ab.missionPoints.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
        }
        if (Array.isArray(ab.statistics)) {
          setStatistics(ab.statistics.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
        }
      } else {
        setErrorMessage(data.message || 'Failed to load About settings.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error loading About settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Vision Points Handlers
  const addVisionPoint = () => {
    setVisionPoints((prev) => [...prev, { title: '', order: prev.length }]);
  };
  const updateVisionPoint = (index: number, value: string) => {
    setVisionPoints((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: value } : item))
    );
  };
  const removeVisionPoint = (index: number) => {
    setVisionPoints((prev) => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })));
  };

  // Mission Points Handlers
  const addMissionPoint = () => {
    setMissionPoints((prev) => [...prev, { title: '', order: prev.length }]);
  };
  const updateMissionPoint = (index: number, value: string) => {
    setMissionPoints((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: value } : item))
    );
  };
  const removeMissionPoint = (index: number) => {
    setMissionPoints((prev) => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })));
  };

  // Statistics Handlers
  const addStatistic = () => {
    setStatistics((prev) => [...prev, { title: '', value: '', icon: 'Globe', order: prev.length }]);
  };
  const updateStatistic = (index: number, field: 'title' | 'value' | 'icon', val: string) => {
    setStatistics((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };
  const removeStatistic = (index: number) => {
    setStatistics((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload = {
      ...formData,
      visionPoints: visionPoints.map((vp, idx) => ({ title: vp.title.trim(), order: idx })),
      missionPoints: missionPoints.map((mp, idx) => ({ title: mp.title.trim(), order: idx })),
      statistics: statistics.map((st, idx) => ({
        title: st.title.trim(),
        value: st.value.trim(),
        icon: st.icon || 'Globe',
        order: idx,
      })),
    };

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('About page details saved successfully!');
        if (data.data) {
          const ab = data.data;
          setFormData({
            title: ab.title || '',
            subtitle: ab.subtitle || '',
            whoWeAreTitle: ab.whoWeAreTitle || '',
            whoWeAreContent: ab.whoWeAreContent || '',
            whyChooseTitle: ab.whyChooseTitle || '',
            whyChooseContent: ab.whyChooseContent || '',
          });
          if (Array.isArray(ab.visionPoints)) setVisionPoints(ab.visionPoints);
          if (Array.isArray(ab.missionPoints)) setMissionPoints(ab.missionPoints);
          if (Array.isArray(ab.statistics)) setStatistics(ab.statistics);
        }
      } else {
        setErrorMessage(data.message || 'Failed to save About details.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error saving About details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#002B49] animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading About details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#002B49]/5 rounded-2xl text-[#002B49]">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-[#002B49]">About Us Section Editor</h1>
            <p className="text-xs text-slate-500 font-medium">Manage company mission, vision, statistics, and highlights.</p>
          </div>
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
        {/* Main Section Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Info className="w-5 h-5 text-[#002B49]" />
            <h2 className="text-base font-bold font-serif text-[#002B49]">Main Header & Subtitle</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Section Heading Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 15+ Years of Trusted Excellence"
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Section Subtitle / Description
              </label>
              <textarea
                name="subtitle"
                rows={2}
                required
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Strategic financial partners helping businesses grow..."
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards: Who We Are & Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Who We Are */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5 text-[#002B49]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">"Who We Are" Card</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Title</label>
                <input
                  type="text"
                  name="whoWeAreTitle"
                  value={formData.whoWeAreTitle}
                  onChange={handleChange}
                  placeholder="Who We Are"
                  className="block w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Content</label>
                <textarea
                  name="whoWeAreContent"
                  rows={4}
                  value={formData.whoWeAreContent}
                  onChange={handleChange}
                  placeholder="A powerhouse team of 10+ partners and 50+ experts..."
                  className="block w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/20"
                />
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-[#002B49]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">"Why Choose Us?" Card</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Title</label>
                <input
                  type="text"
                  name="whyChooseTitle"
                  value={formData.whyChooseTitle}
                  onChange={handleChange}
                  placeholder="Why Choose Us?"
                  className="block w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Content</label>
                <textarea
                  name="whyChooseContent"
                  rows={4}
                  value={formData.whyChooseContent}
                  onChange={handleChange}
                  placeholder="We offer a fresh, practical approach to tax planning..."
                  className="block w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Points Managers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision Points */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold font-serif text-[#002B49]">Our Vision Points</h2>
              </div>
              <button
                type="button"
                onClick={addVisionPoint}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Title</label>
                <input
                  type="text"
                  name="whoWeAreTitle"
                  value={formData.whoWeAreTitle}
                  onChange={handleChange}
                  placeholder="Who We Are"
                  className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Content</label>
                <textarea
                  name="whoWeAreContent"
                  rows={4}
                  value={formData.whoWeAreContent}
                  onChange={handleChange}
                  placeholder="A powerhouse team of 10+ partners and 50+ experts..."
                  className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-[#002B49]" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">"Why Choose Us?" Card</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Title</label>
                <input
                  type="text"
                  name="whyChooseTitle"
                  value={formData.whyChooseTitle}
                  onChange={handleChange}
                  placeholder="Why Choose Us?"
                  className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Card Content</label>
                <textarea
                  name="whyChooseContent"
                  rows={4}
                  value={formData.whyChooseContent}
                  onChange={handleChange}
                  placeholder="We offer a fresh, practical approach to tax planning..."
                  className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Points Managers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision Points */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold font-serif text-[#002B49]">Our Vision Points</h2>
              </div>
              <button
                type="button"
                onClick={addVisionPoint}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-3">
              {visionPoints.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg shrink-0">
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateVisionPoint(index, e.target.value)}
                    placeholder="e.g. Building seamless lean cultures."
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeVisionPoint(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Points */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" />
                <h2 className="text-base font-bold font-serif text-[#002B49]">Our Mission Points</h2>
              </div>
              <button
                type="button"
                onClick={addMissionPoint}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point</span>
              </button>
            </div>

            <div className="space-y-3">
              {missionPoints.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg shrink-0">
                    #{index + 1}
                  </span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateMissionPoint(index, e.target.value)}
                    placeholder="e.g. Turning innovative ideas into reality."
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeMissionPoint(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Manager */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold font-serif text-[#002B49]">Key Highlights & Statistics</h2>
            </div>
            <button
              type="button"
              onClick={addStatistic}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statistics.map((stat, index) => (
              <div key={index} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Stat #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeStatistic(index)}
                    className="p-1 text-red-500 hover:bg-red-100/50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Title / Label</label>
                  <input
                    type="text"
                    value={stat.title}
                    onChange={(e) => updateStatistic(index, 'title', e.target.value)}
                    placeholder="e.g. Global Presence"
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Sub-Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                    placeholder="e.g. India, USA & Dubai"
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Lucide Icon</label>
                  <select
                    value={stat.icon || 'Globe'}
                    onChange={(e) => updateStatistic(index, 'icon', e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all"
                  >
                    <option value="Globe" className="text-slate-900 bg-white font-semibold">Globe</option>
                    <option value="Shield" className="text-slate-900 bg-white font-semibold">Shield</option>
                    <option value="TrendingUp" className="text-slate-900 bg-white font-semibold">TrendingUp</option>
                    <option value="Users" className="text-slate-900 bg-white font-semibold">Users</option>
                    <option value="Award" className="text-slate-900 bg-white font-semibold">Award</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#002B49] hover:bg-[#00A79D] text-white rounded-2xl text-xs font-bold shadow-lg shadow-[#002B49]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#FDB913]" />
            <span>{saving ? 'Saving Changes...' : 'Save About Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
