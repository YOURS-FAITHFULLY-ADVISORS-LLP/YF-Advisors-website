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
  FileText, 
  Image as ImageIcon,
  Tag,
  Eye,
  User, 
  RefreshCw,
  Bold,
  Italic,
  List,
  Quote,
  Link as LinkIcon,
  Code,
  Wand2,
  Sparkles
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';
import RichTextEditor from './RichTextEditor';
import { cleanAndSanitizeHtml, convertPlainTextToSemanticHtml } from '@/src/lib/html-formatter';

interface BlogSection {
  id?: string;
  heading: string;
  content: string;
  displayOrder: number;
}

interface BlogEditorProps {
  blogId?: string;
}

// Convert plain text with newlines to clean HTML <p> tags if no HTML present
function ensureHtmlFormatting(input: string): string {
  if (!input || !input.trim()) return '';
  const trimmed = input.trim();
  
  // If it already contains HTML tags, return as is
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }

  // Otherwise, split by double line breaks and wrap each paragraph in <p>
  return trimmed
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
}

export default function BlogEditor({ blogId }: BlogEditorProps) {
  const router = useRouter();
  const isNew = !blogId;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    cardDescription: '',
    excerpt: '',
    image: '',
    category: 'Services',
    tags: '',
    author: 'YF Advisors',
    content: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
  });

  const [sections, setSections] = useState<BlogSection[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [savedSlug, setSavedSlug] = useState('');

  const mainContentRef = useRef<HTMLTextAreaElement | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const fetchBlog = async () => {
    if (!blogId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const b = data.data;
        setFormData({
          title: b.title || '',
          slug: b.slug || '',
          cardDescription: b.cardDescription || '',
          excerpt: b.excerpt || '',
          image: b.image || '',
          category: b.category || 'Services',
          tags: b.tags || '',
          author: b.author || 'YF Advisors',
          content: b.content || '',
          status: b.status || 'PUBLISHED',
        });
        if (Array.isArray(b.sections)) {
          const sortedSections = [...b.sections].sort(
            (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
          );
          setSections(sortedSections);
        }
      } else {
        setErrorMessage(data.message || 'Failed to fetch blog details');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error fetching blog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew) {
      fetchBlog();
    }
  }, [blogId]);

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

  // Helper to insert formatting tags into a textarea
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

  // Section Handlers
  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        heading: '',
        content: '',
        displayOrder: prev.length,
      },
    ]);
  };

  const handleSectionChange = (index: number, field: 'heading' | 'content', value: string) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, [field]: value } : sec))
    );
  };

  const handleRemoveSection = (index: number) => {
    setSections((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((sec, i) => ({ ...sec, displayOrder: i }))
    );
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const reordered = newSections.map((sec, i) => ({ ...sec, displayOrder: i }));
    setSections(reordered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Auto-format plain text into clean, structured semantic HTML
    const formattedContent = convertPlainTextToSemanticHtml(formData.content);
    const formattedSections = sections.map((sec, index) => ({
      heading: sec.heading.trim(),
      content: convertPlainTextToSemanticHtml(sec.content),
      displayOrder: index,
    }));

    const payload = {
      ...formData,
      content: formattedContent,
      sections: formattedSections,
    };

    try {
      const url = isNew ? '/api/admin/blogs' : `/api/admin/blogs/${blogId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          isNew ? 'Blog article created successfully!' : 'Blog article updated successfully!'
        );
        if (isNew && data.data?.id) {
          setTimeout(() => {
            router.push(`/admin/blogs/${data.data.id}`);
          }, 1000);
        }
      } else {
        setErrorMessage(data.message || data.errors?.[0] || 'Failed to save blog article.');
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
        <p className="text-xs text-slate-500 font-medium">Loading blog editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Back to blogs list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#002B49] tracking-tight">
              {isNew ? 'Create New Blog Post' : 'Edit Blog Article'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {isNew
                ? 'Publish fresh content to the YF Advisors insights blog.'
                : `Editing: ${formData.title || 'Blog Post'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/blogs"
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
            <span>{saving ? 'Saving...' : isNew ? 'Publish Blog' : 'Save Changes'}</span>
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Details Section */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <FileText className="w-5 h-5 text-[#002B49]" />
            <h2 className="text-base font-bold font-serif text-[#002B49]">Article Information</h2>
          </div>

          <div className="space-y-5">
            {/* Title & Slug Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Spark of Hope"
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
                  placeholder="e.g. spark-of-hope"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all font-mono text-xs"
                />
              </div>
            </div>

            {/* Category, Author, Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Services / News and Events"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="YF Advisors"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>

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
            </div>

            {/* Card Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Card Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="cardDescription"
                rows={2}
                required
                value={formData.cardDescription}
                onChange={handleChange}
                placeholder="A concise summary for the blog card preview on the site..."
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                rows={2}
                required
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Opening snippet or summary of the article..."
                className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
              />
            </div>

            {/* Featured Image & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ImageUploadInput
                label="Featured Image"
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                folder="blog"
                placeholder="https://.../spark.jpg"
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="outsourcing, advisory, finance"
                  className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Main Content Body with RichTextEditor */}
            <RichTextEditor
              label="Main Intro / Content Body"
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              placeholder="Paste or type content here from Word, ChatGPT, Google Docs, or Notepad..."
              rows={8}
            />
          </div>
        </div>

        {/* Blog Sections Manager */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold font-serif text-[#002B49]">Article Sub-Sections</h2>
              <p className="text-xs text-slate-500 font-medium">
                Add structured headings and content blocks. Plain text auto-wraps into paragraph tags.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#002B49] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium">No sub-sections added yet.</p>
              <button
                type="button"
                onClick={handleAddSection}
                className="mt-2 text-xs font-bold text-[#002B49] hover:underline cursor-pointer"
              >
                + Add your first section
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
                      Section {index + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(index, 'down')}
                        disabled={index === sections.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-100/50 cursor-pointer"
                        title="Remove Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                      placeholder="e.g. Introduction or Key Benefits Breakdown"
                      className="block w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#002B49]/20 focus:border-[#002B49] transition-all"
                    />
                  </div>

                  <RichTextEditor
                    label="Section Body Content"
                    value={section.content}
                    onChange={(val) => handleSectionChange(index, 'content', val)}
                    placeholder="Paste or type section content from ChatGPT, Word, Google Docs..."
                    rows={5}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/blogs"
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
            <span>{saving ? 'Saving Article...' : isNew ? 'Publish Blog Article' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
