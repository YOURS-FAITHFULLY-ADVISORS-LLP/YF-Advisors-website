'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase,
  Sparkles,
  Layers,
  Check,
  RefreshCw,
  Bold,
  Italic,
  List,
  Quote,
  Link as LinkIcon
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { convertPlainTextToSemanticHtml } from '@/src/lib/html-formatter';

interface CollectionItem {
  id?: string;
  title: string;
  description: string;
  order?: number;
}

interface WorkStepItem {
  id?: string;
  stepNumber: number;
  title: string;
  description: string;
}

interface ServiceEditorProps {
  serviceId?: string;
}

function ensureHtmlFormatting(input: string): string {
  if (!input || !input.trim()) return '';
  const trimmed = input.trim();
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }
  return trimmed
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
}

export default function ServiceEditor({ serviceId }: ServiceEditorProps) {
  const router = useRouter();
  const isNew = !serviceId;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: 'Briefcase',
    cardDescription: '',
    keyValue: '',
    description: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
  });

  const [offerings, setOfferings] = useState<CollectionItem[]>([]);
  const [capabilities, setCapabilities] = useState<CollectionItem[]>([]);
  const [benefits, setBenefits] = useState<CollectionItem[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<CollectionItem[]>([]);
  const [workSteps, setWorkSteps] = useState<WorkStepItem[]>([]);

  const [activeTab, setActiveTab] = useState<'offerings' | 'capabilities' | 'benefits' | 'whyChooseUs' | 'workSteps'>('offerings');

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mainDescRef = useRef<HTMLTextAreaElement | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const fetchService = async () => {
    if (!serviceId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const s = data.data;
        setFormData({
          title: s.title || '',
          slug: s.slug || '',
          icon: s.icon || 'Briefcase',
          cardDescription: s.cardDescription || '',
          keyValue: s.keyValue || '',
          description: s.description || '',
          status: s.status || 'PUBLISHED',
        });

        if (Array.isArray(s.offerings)) setOfferings(s.offerings);
        if (Array.isArray(s.capabilities)) setCapabilities(s.capabilities);
        if (Array.isArray(s.benefits)) setBenefits(s.benefits);
        if (Array.isArray(s.whyChooseUs)) setWhyChooseUs(s.whyChooseUs);
        if (Array.isArray(s.workSteps)) setWorkSteps(s.workSteps);
      } else {
        setErrorMessage(data.message || 'Failed to fetch service details');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew) {
      fetchService();
    }
  }, [serviceId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const insertFormatting = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
    tagType: 'bold' | 'italic' | 'list' | 'quote' | 'link' | 'para',
    setValue: (val: string) => void,
    currentValue: string
  ) => {
    const textarea = ref.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = currentValue.substring(start, end) || 'text';

    let openTag = '';
    let closeTag = '';

    switch (tagType) {
      case 'bold':
        openTag = '<strong>';
        closeTag = '</strong>';
        break;
      case 'italic':
        openTag = '<em>';
        closeTag = '</em>';
        break;
      case 'para':
        openTag = '<p>';
        closeTag = '</p>';
        break;
      case 'quote':
        openTag = '<blockquote>';
        closeTag = '</blockquote>';
        break;
      case 'list':
        openTag = '<ul>\n  <li>';
        closeTag = '</li>\n</ul>';
        break;
      case 'link':
        const url = prompt('Enter link URL:', 'https://');
        if (!url) return;
        openTag = `<a href="${url}">`;
        closeTag = '</a>';
        break;
    }

    const replacement = openTag + selected + closeTag;
    const updated = currentValue.substring(0, start) + replacement + currentValue.substring(end);
    setValue(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 0);
  };

  // Handlers for Collection Lists (Offerings, Capabilities, Benefits, WhyChooseUs)
  const addItem = (
    setter: React.Dispatch<React.SetStateAction<CollectionItem[]>>
  ) => {
    setter((prev) => [...prev, { title: '', description: '', order: prev.length }]);
  };

  const updateItem = (
    setter: React.Dispatch<React.SetStateAction<CollectionItem[]>>,
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    setter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<CollectionItem[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Handlers for Work Steps
  const addWorkStep = () => {
    setWorkSteps((prev) => [
      ...prev,
      { stepNumber: prev.length + 1, title: '', description: '' },
    ]);
  };

  const updateWorkStep = (index: number, field: 'title' | 'description', value: string) => {
    setWorkSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    );
  };

  const removeWorkStep = (index: number) => {
    setWorkSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload = {
      ...formData,
      description: convertPlainTextToSemanticHtml(formData.description),
      offerings: offerings.map((item, idx) => ({ ...item, order: idx })),
      capabilities: capabilities.map((item, idx) => ({ ...item, order: idx })),
      benefits: benefits.map((item, idx) => ({ ...item, order: idx })),
      whyChooseUs: whyChooseUs.map((item, idx) => ({ ...item, order: idx })),
      workSteps: workSteps.map((step, idx) => ({ ...step, stepNumber: idx + 1 })),
    };

    try {
      const url = isNew ? '/api/admin/services' : `/api/admin/services/${serviceId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isNew ? 'Service created successfully!' : 'Service updated successfully!'
        );
        if (isNew && data.data?.id) {
          setTimeout(() => {
            router.push(`/admin/services/${data.data.id}`);
          }, 1000);
        }
      } else {
        setErrorMessage(data.message || data.errors?.[0] || 'Failed to save service.');
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
        <p className="text-xs text-slate-500 font-medium">Loading service details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link
            href="/admin/services"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
            title="Back to services list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight truncate">
              {isNew ? 'Create New Service' : 'Edit Service'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
              {isNew
                ? 'Catalog a new service offering for YF Advisors.'
                : `Editing: ${formData.title || 'Service'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <Link
            href="/admin/services"
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
            <span>{saving ? 'Saving...' : isNew ? 'Publish Service' : 'Save Changes'}</span>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Briefcase className="w-5 h-5 text-[#002B49]" />
            <h2 className="text-base font-bold font-serif text-[#002B49]">Service Overview</h2>
          </div>

          <div className="space-y-5">
            {/* Title & Slug Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Manpower Outsourcing"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. manpower-outsourcing"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all font-mono text-xs"
                />
              </div>
            </div>

            {/* Key Value, Icon, Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Key Value Badge
                </label>
                <input
                  type="text"
                  name="keyValue"
                  value={formData.keyValue}
                  onChange={handleChange}
                  placeholder="e.g. Cost Efficiency"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Lucide Icon Name
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="UserCheck / Settings / FileText"
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

            {/* Card Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Card Short Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                name="cardDescription"
                rows={2}
                required
                value={formData.cardDescription}
                onChange={handleChange}
                placeholder="Short summary displayed on service cards..."
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            {/* Main Description with RichTextEditor */}
            <RichTextEditor
              label="Full Service Detailed Description"
              value={formData.description}
              onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))}
              placeholder="Enter full comprehensive service overview or paste from Word, ChatGPT..."
              rows={8}
            />
          </div>
        </div>

        {/* Sub-Collections Tabs Section */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold font-serif text-[#002B49]">Service Modules & Modules</h2>
              <p className="text-xs text-slate-500 font-medium">Manage offerings, capabilities, benefits, and step-by-step workflow.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'offerings', label: `Offerings (${offerings.length})` },
              { id: 'capabilities', label: `Capabilities (${capabilities.length})` },
              { id: 'benefits', label: `Benefits (${benefits.length})` },
              { id: 'whyChooseUs', label: `Why Choose Us (${whyChooseUs.length})` },
              { id: 'workSteps', label: `Work Steps (${workSteps.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#002B49] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Offerings */}
          {activeTab === 'offerings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Service Offerings</span>
                <button
                  type="button"
                  onClick={() => addItem(setOfferings)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Offering</span>
                </button>
              </div>

              {offerings.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No offerings added.</p>
              ) : (
                <div className="space-y-4">
                  {offerings.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">Offering #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(setOfferings, idx)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title (e.g. Temporary Staffing)"
                        value={item.title}
                        onChange={(e) => updateItem(setOfferings, idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description..."
                        value={item.description}
                        onChange={(e) => updateItem(setOfferings, idx, 'description', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Capabilities */}
          {activeTab === 'capabilities' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Service Capabilities</span>
                <button
                  type="button"
                  onClick={() => addItem(setCapabilities)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Capability</span>
                </button>
              </div>

              {capabilities.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No capabilities added.</p>
              ) : (
                <div className="space-y-4">
                  {capabilities.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">Capability #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(setCapabilities, idx)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title (e.g. Strategic Staffing)"
                        value={item.title}
                        onChange={(e) => updateItem(setCapabilities, idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description..."
                        value={item.description}
                        onChange={(e) => updateItem(setCapabilities, idx, 'description', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Benefits */}
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Client Benefits</span>
                <button
                  type="button"
                  onClick={() => addItem(setBenefits)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Benefit</span>
                </button>
              </div>

              {benefits.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No benefits added.</p>
              ) : (
                <div className="space-y-4">
                  {benefits.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">Benefit #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(setBenefits, idx)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title (e.g. Cost Efficiency)"
                        value={item.title}
                        onChange={(e) => updateItem(setBenefits, idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description..."
                        value={item.description}
                        onChange={(e) => updateItem(setBenefits, idx, 'description', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Why Choose Us */}
          {activeTab === 'whyChooseUs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Why Choose Us Points</span>
                <button
                  type="button"
                  onClick={() => addItem(setWhyChooseUs)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Point</span>
                </button>
              </div>

              {whyChooseUs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No points added.</p>
              ) : (
                <div className="space-y-4">
                  {whyChooseUs.map((item, idx) => (
                    <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">Point #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(setWhyChooseUs, idx)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title (e.g. Expertise You Can Trust)"
                        value={item.title}
                        onChange={(e) => updateItem(setWhyChooseUs, idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description..."
                        value={item.description}
                        onChange={(e) => updateItem(setWhyChooseUs, idx, 'description', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Work Steps */}
          {activeTab === 'workSteps' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#002B49] uppercase tracking-wider">Step-by-Step Workflow</span>
                <button
                  type="button"
                  onClick={addWorkStep}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              {workSteps.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No work steps added.</p>
              ) : (
                <div className="space-y-4">
                  {workSteps.map((step, idx) => (
                    <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">Step #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeWorkStep(idx)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Title (e.g. Requirement Analysis)"
                        value={step.title}
                        onChange={(e) => updateWorkStep(idx, 'title', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Step description..."
                        value={step.description}
                        onChange={(e) => updateWorkStep(idx, 'description', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/services"
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
            <span>{saving ? 'Saving Service...' : isNew ? 'Publish Service' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
