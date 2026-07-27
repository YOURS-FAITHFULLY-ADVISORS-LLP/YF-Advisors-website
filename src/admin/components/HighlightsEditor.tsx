'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles as SparklesIcon,
  UploadCloud as UploadIcon,
  Image as ImageIcon,
  Image as ImageIcon2,
  HardDrive as HardDriveIcon,
  Clock as ClockIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Edit3 as EditIcon,
  MoreVertical as MoreIcon,
  GripVertical as GripIcon,
  CheckCircle2 as CheckIcon,
  AlertCircle as AlertIcon,
  Loader2 as LoaderIcon,
  X as CloseIcon,
  ExternalLink as ExternalLinkIcon,
  Eye as EyeIcon,
  RefreshCw as RefreshIcon
} from 'lucide-react';

interface HighlightItem {
  id?: string;
  src: string;
  alt: string;
  title?: string;
  size?: string;
  createdAt?: string;
}

export default function HighlightsAdminEditor() {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [initialHighlights, setInitialHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalPreview, setModalPreview] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalAlt, setModalAlt] = useState('');
  const [isUploadingModal, setIsUploadingModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Card Modals & States
  const [previewItem, setPreviewItem] = useState<HighlightItem | null>(null);
  const [renameModalIndex, setRenameModalIndex] = useState<number | null>(null);
  const [renameText, setRenameText] = useState('');
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const modalFileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/highlights?includeDrafts=true', { credentials: 'include' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHighlights(data.data);
        setInitialHighlights(data.data);
      }
    } catch (err) {
      console.error('Fetch highlights error:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasUnsavedChanges = JSON.stringify(highlights) !== JSON.stringify(initialHighlights);

  // Handle Modal File Selection
  const handleModalFileSelect = (file: File | null) => {
    if (!file) return;
    setModalError(null);

    if (file.size > 2 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setModalError(`"${file.name}" is ${sizeMB}MB — exceeds the 2MB limit. Please choose a smaller image.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setModalError('Invalid file type. Only image files (PNG, JPG, WEBP, SVG) are allowed.');
      return;
    }

    setModalFile(file);
    setModalPreview(URL.createObjectURL(file));
    if (!modalTitle) {
      setModalTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  // Upload Highlight from Modal
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingModal) return; // Prevent double submission
    if (!modalFile) {
      setModalError('Please select an image file to upload.');
      return;
    }

    setIsUploadingModal(true);
    setMessage(null);
    setModalError(null);

    try {
      const formData = new FormData();
      formData.append('file', modalFile);
      formData.append('folder', 'highlights');

      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.url) {
        const createRes = await fetch('/api/admin/highlights', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            src: data.data.url,
            alt: modalTitle || modalAlt || 'YF Advisors Highlight',
            displayOrder: highlights.length
          })
        });
        const createdData = await createRes.json();
        if (createdData.success && createdData.data) {
          setHighlights(prev => [...prev, createdData.data]);
          setMessage({ type: 'success', text: 'Highlight uploaded and added to collection!' });
          // Reset and close modal
          setIsUploadModalOpen(false);
          setModalFile(null);
          setModalPreview(null);
          setModalTitle('');
          setModalAlt('');
        } else {
          setMessage({ type: 'error', text: createdData.message || 'Failed to save highlight in database.' });
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload image to Supabase.' });
      }
    } catch (err) {
      console.error('Upload modal error:', err);
      setMessage({ type: 'error', text: 'Network error uploading file.' });
    } finally {
      setIsUploadingModal(false);
    }
  };

  // Replace Image functionality
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingIndex === null) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Selected image exceeds max 2MB limit.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'highlights');

      const res = await fetch('/api/admin/uploads', { method: 'POST', credentials: 'include', body: formData });
      const data = await res.json();

      if (res.ok && data.success && data.data?.url) {
        const updated = [...highlights];
        updated[replacingIndex].src = data.data.url;
        setHighlights(updated);
        setMessage({ type: 'success', text: 'Image replaced successfully!' });
      }
    } catch (err) {
      console.error('Replace error:', err);
    } finally {
      setReplacingIndex(null);
      e.target.value = '';
    }
  };

  // Delete item with confirmation
  const handleDeleteItem = async (index: number) => {
    const item = highlights[index];
    if (item.id) {
      try {
        await fetch(`/api/admin/highlights/${item.id}`, { method: 'DELETE', credentials: 'include' });
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
    const updated = highlights.filter((_, i) => i !== index);
    setHighlights(updated);
    setDeleteConfirmIndex(null);
    setActiveMenuIndex(null);
    if (previewItem?.id === item.id) setPreviewItem(null);
    setMessage({ type: 'success', text: 'Highlight deleted successfully.' });
  };

  // Save all changes
  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    try {
      for (let i = 0; i < highlights.length; i++) {
        const item = highlights[i];
        if (item.src.trim()) {
          await fetch('/api/admin/highlights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...item,
              displayOrder: i
            })
          });
        }
      }
      setInitialHighlights(highlights);
      setMessage({ type: 'success', text: 'Company Highlights saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save highlights' });
    } finally {
      setSaving(false);
    }
  };

  // Drag & Drop Reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...highlights];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(index, 0, item);
    setDraggedIndex(index);
    setHighlights(updated);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalImages = highlights.length;
  const estimatedStorage = (totalImages * 1.2).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans pb-32">
      {/* Hidden File Input for Replace */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-50 text-[#00A79D]">🖼</span>
            Company Highlights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage images displayed in the Company Highlights section of the website.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => { setModalError(null); setModalFile(null); setModalPreview(null); setModalTitle(''); setModalAlt(''); setIsUploadModalOpen(true); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00A79D] hover:bg-[#008f85] text-white text-xs font-bold shadow-md shadow-teal-500/20 transition-all cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Upload Images</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving || !hasUnsavedChanges}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <LoaderIcon className="w-4 h-4 animate-spin text-[#00A79D]" /> : null}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* ================= STATISTICS CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00A79D] flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Images</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{totalImages}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <HardDriveIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Storage Used</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{estimatedStorage} MB</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ClockIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">Today</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Featured Images</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{totalImages}</h3>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? (
              <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertIcon className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= GALLERY COLLECTION GRID ================= */}
      {highlights.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Gallery Collection ({highlights.length})
            </h2>
            <span className="text-[11px] text-slate-400">Drag cards to reorder</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <div
                key={item.id || index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                className="relative group bg-white rounded-3xl border border-slate-200/80 hover:border-[#00A79D] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Drag Handle & Menu Header */}
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
                  <span
                    className="p-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/60 transition-colors cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                  >
                    <GripIcon className="w-3.5 h-3.5" />
                  </span>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuIndex(activeMenuIndex === index ? null : index);
                      }}
                      className="p-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/60 transition-colors"
                    >
                      <MoreIcon className="w-3.5 h-3.5" />
                    </button>

                    {/* Three-dot Dropdown Menu */}
                    {activeMenuIndex === index && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-8 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95"
                      >
                        <button
                          onClick={() => {
                            setRenameModalIndex(index);
                            setRenameText(item.alt);
                            setActiveMenuIndex(null);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <EditIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={() => {
                            setReplacingIndex(index);
                            replaceInputRef.current?.click();
                            setActiveMenuIndex(null);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <RefreshIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Replace Image</span>
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirmIndex(index);
                            setActiveMenuIndex(null);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <TrashIcon className="w-3.5 h-3.5 text-rose-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Preview Box */}
                <div
                  className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setPreviewItem(item)}
                >
                  <img
                    src={item.src}
                    alt={item.alt || 'Highlight Image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      <EyeIcon className="w-3.5 h-3.5" /> Preview
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 space-y-1.5 bg-white">
                  <h4 className="text-xs font-extrabold text-slate-900 truncate" title={item.alt}>
                    {item.alt || 'Untitled Image'}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Upload Date: Today</span>
                    <span>~1.2 MB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= COMPACT EMPTY STATE ================= */
        <div className="bg-white px-6 py-8 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00A79D] flex items-center justify-center text-2xl">
            🖼
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Company Highlights Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Upload your first image using the Upload Images button above to display in the Company Highlights gallery.
            </p>
          </div>
        </div>
      )}

      {/* ================= UPLOAD MODAL DIALOG (Centered, ~500-600px) ================= */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UploadIcon className="w-5 h-5 text-[#00A79D]" />
                Upload Company Highlight
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleModalFileSelect(e.target.files[0])}
              />

              {/* Drag & Drop File Picker Box */}
              <div
                onClick={() => modalFileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files?.[0]) handleModalFileSelect(e.dataTransfer.files[0]);
                }}
                className="border-2 border-dashed border-slate-200 hover:border-[#00A79D] bg-slate-50/50 hover:bg-teal-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                {modalPreview ? (
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                    <img src={modalPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-[#00A79D] group-hover:bg-[#00A79D] group-hover:text-white flex items-center justify-center transition-colors">
                      <UploadIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Drag & Drop or <span className="text-[#00A79D] underline">Browse Image</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP, SVG • Max 2MB</p>
                    </div>
                  </>
                )}
              </div>

              {/* Modal-local error message */}
              {modalError && (
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <AlertIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-600 leading-relaxed">{modalError}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Highlight Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Team Lunch 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white text-xs font-medium focus:outline-none focus:border-[#00A79D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Alt Text / Description
                </label>
                <input
                  type="text"
                  value={modalAlt}
                  onChange={(e) => setModalAlt(e.target.value)}
                  placeholder="Short image description for accessibility"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white text-xs font-medium focus:outline-none focus:border-[#00A79D]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingModal}
                  className="flex-1 py-2.5 rounded-xl bg-[#00A79D] hover:bg-[#008f85] text-white text-xs font-bold shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isUploadingModal ? <LoaderIcon className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Upload Highlight</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RENAME MODAL DIALOG ================= */}
      {renameModalIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setRenameModalIndex(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900">Rename Highlight</h3>
              <button onClick={() => setRenameModalIndex(null)} className="text-slate-400 hover:text-slate-600">
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Highlight Name</label>
              <input
                type="text"
                value={renameText}
                onChange={(e) => setRenameText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white text-xs font-medium focus:outline-none focus:border-[#00A79D]"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRenameModalIndex(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = [...highlights];
                  updated[renameModalIndex].alt = renameText;
                  setHighlights(updated);
                  setRenameModalIndex(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#00A79D] text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= UNSAVED CHANGES STICKY FOOTER ================= */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-3xl shadow-2xl border border-slate-800 flex items-center gap-6 animate-in slide-in-from-bottom-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold">Unsaved Changes</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHighlights}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-[#00A79D] hover:bg-[#008f85] text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
            >
              {saving ? <LoaderIcon className="w-3 h-3 animate-spin" /> : null}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative md:w-1/2 bg-slate-900 flex items-center justify-center min-h-[250px]">
              <img
                src={previewItem.src}
                alt={previewItem.alt}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900">Image Details</h3>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                  <p className="text-xs font-bold text-slate-800">{previewItem.alt || 'Untitled'}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">File Name</label>
                  <p className="text-[11px] font-mono text-slate-600 truncate">{previewItem.src.split('/').pop()}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">File Size</label>
                  <p className="text-xs font-bold text-slate-700">~1.2 MB</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <a
                  href={previewItem.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                  <span>View Full</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      {deleteConfirmIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmIndex(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <TrashIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Delete this highlight?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This image will be permanently removed from Supabase storage and database.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setDeleteConfirmIndex(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmIndex)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
