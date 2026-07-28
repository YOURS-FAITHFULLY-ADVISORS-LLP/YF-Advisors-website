'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles as SparklesIcon,
  UploadCloud as UploadIcon,
  Image as ImageIcon,
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
  RefreshCw as RefreshIcon,
  CheckSquare as CheckSquareIcon
} from 'lucide-react';

interface HighlightItem {
  id?: string;
  src: string;
  alt: string;
  title?: string;
  size?: string;
  createdAt?: string;
}

interface UploadFileQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  alt: string;
  sizeMB: string;
  isValid: boolean;
  error?: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
}

export default function HighlightsAdminEditor() {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [initialHighlights, setInitialHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selection & Bulk Actions State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);

  // Multi-Image Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalFiles, setModalFiles] = useState<UploadFileQueueItem[]>([]);
  const [isUploadingModal, setIsUploadingModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; currentFileName: string } | null>(null);
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
  const uploadingRef = useRef(false); // Ref-based mutex for upload
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  // Auto-Dismissing Notification Banner Helper (6s)
  const showNotification = (msg: { type: 'success' | 'error'; text: string }) => {
    setMessage(msg);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => {
      setMessage(null);
    }, 6000);
  };

  useEffect(() => {
    fetchHighlights();
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
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

  // Handle Selection & Select All
  const toggleSelectItem = (id?: string) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const validHighlightIds = highlights.map((h) => h.id).filter(Boolean) as string[];
  const isAllSelected = validHighlightIds.length > 0 && validHighlightIds.every((id) => selectedIds.includes(id));
  const isSomeSelected = selectedIds.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(validHighlightIds);
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeletingBulk(true);

    try {
      const res = await fetch('/api/admin/highlights', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const remaining = highlights.filter((h) => !h.id || !selectedIds.includes(h.id));
        setHighlights(remaining);
        setInitialHighlights(remaining);
        showNotification({
          type: 'success',
          text: `Successfully deleted ${selectedIds.length} highlight(s) from database and storage.`
        });
        setSelectedIds([]);
        setIsSelectionMode(false);
        setIsBulkDeleteModalOpen(false);
      } else {
        showNotification({
          type: 'error',
          text: data.message || 'Failed to delete selected highlights.'
        });
      }
    } catch (err: any) {
      showNotification({
        type: 'error',
        text: err.message || 'Network error deleting highlights.'
      });
    } finally {
      setDeletingBulk(false);
    }
  };

  // Handle Multi-File Selection (Supports selecting multiple files at once)
  const MAX_HIGHLIGHT_SIZE = 2 * 1024 * 1024; // 2MB strict limit for highlights

  const handleModalFilesSelect = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setModalError(null);

    const newItems: UploadFileQueueItem[] = [];
    const invalidFileSummaries: string[] = [];

    Array.from(files).forEach((file) => {
      const sizeMBNum = file.size / (1024 * 1024);
      const sizeMB = sizeMBNum.toFixed(2);
      let isValid = true;
      let errorMsg = '';

      if (!file.type.startsWith('image/')) {
        isValid = false;
        errorMsg = 'Invalid file format';
        invalidFileSummaries.push(`"${file.name}" (Invalid format)`);
      } else if (file.size > MAX_HIGHLIGHT_SIZE) {
        isValid = false;
        errorMsg = `Exceeds 2MB limit (${sizeMB} MB)`;
        invalidFileSummaries.push(`"${file.name}" (${sizeMB} MB exceeds 2MB)`);
      }

      const defaultTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      newItems.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now(),
        file,
        previewUrl: URL.createObjectURL(file),
        title: defaultTitle,
        alt: defaultTitle,
        sizeMB,
        isValid,
        error: errorMsg,
        status: 'idle'
      });
    });

    if (invalidFileSummaries.length > 0) {
      setModalError(
        `${invalidFileSummaries.length} file(s) failed size or format check:\n` +
          invalidFileSummaries.join(' • ')
      );
    }

    setModalFiles((prev) => [...prev, ...newItems]);
  };

  const removeModalFile = (id: string) => {
    setModalFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      const remaining = prev.filter((f) => f.id !== id);
      if (!remaining.some((f) => !f.isValid)) {
        setModalError(null);
      }
      return remaining;
    });
  };

  const removeInvalidFiles = () => {
    setModalFiles((prev) => {
      prev.forEach((f) => {
        if (!f.isValid && f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
      return prev.filter((f) => f.isValid);
    });
    setModalError(null);
  };

  const clearModalFiles = () => {
    modalFiles.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setModalFiles([]);
    setModalError(null);
    setUploadProgress(null);
  };

  // Upload Highlights Sequentially One-by-One and save each in DB separately
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingRef.current) return;

    const validItems = modalFiles.filter((item) => item.isValid && item.status !== 'success');
    if (validItems.length === 0) {
      setModalError('No valid images ready for upload. Please select files under 2MB limit.');
      return;
    }

    uploadingRef.current = true;
    setIsUploadingModal(true);
    setMessage(null);
    setModalError(null);

    let successCount = 0;
    let failCount = 0;
    const currentList = [...highlights];

    for (let i = 0; i < validItems.length; i++) {
      const item = validItems[i];

      setUploadProgress({
        current: i + 1,
        total: validItems.length,
        currentFileName: item.file.name
      });

      // Update current file status to 'uploading'
      setModalFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'uploading' } : f))
      );

      try {
        // Step 1: Upload image file to Supabase Storage
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('folder', 'highlights');

        const uploadRes = await fetch('/api/admin/uploads', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.success && uploadData.data?.url) {
          // Step 2: Save highlight record separately in database
          const createRes = await fetch('/api/admin/highlights', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              src: uploadData.data.url,
              alt: item.title || item.alt || 'YF Advisors Highlight',
              displayOrder: currentList.length
            })
          });

          const createdData = await createRes.json();

          if (createdData.success && createdData.data) {
            successCount++;
            currentList.push(createdData.data);

            // Real-time update gallery collection in editor state
            setHighlights([...currentList]);
            setInitialHighlights([...currentList]);

            setModalFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, status: 'success' } : f))
            );
          } else {
            failCount++;
            setModalFiles((prev) =>
              prev.map((f) =>
                f.id === item.id
                  ? { ...f, status: 'error', error: createdData.message || 'Failed to save in DB' }
                  : f
              )
            );
          }
        } else {
          failCount++;
          setModalFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? { ...f, status: 'error', error: uploadData.message || 'Failed to upload image' }
                : f
            )
          );
        }
      } catch (err: any) {
        failCount++;
        setModalFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: 'error', error: err.message || 'Network error' } : f
          )
        );
      }
    }

    uploadingRef.current = false;
    setIsUploadingModal(false);
    setUploadProgress(null);

    if (failCount === 0) {
      showNotification({
        type: 'success',
        text: `All ${successCount} highlight image(s) uploaded and saved to collection!`
      });
      setTimeout(() => {
        clearModalFiles();
        setIsUploadModalOpen(false);
      }, 700);
    } else {
      showNotification({
        type: successCount > 0 ? 'success' : 'error',
        text: `Uploaded ${successCount} image(s). ${failCount} file(s) failed.`
      });
    }
  };

  // Replace single Image functionality
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingIndex === null) return;

    if (file.size > MAX_HIGHLIGHT_SIZE) {
      showNotification({ type: 'error', text: 'Selected image exceeds max 2MB limit.' });
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
        showNotification({ type: 'success', text: 'Image replaced successfully!' });
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
    if (item.id) setSelectedIds((prev) => prev.filter((i) => i !== item.id));
    if (previewItem?.id === item.id) setPreviewItem(null);
    showNotification({ type: 'success', text: 'Highlight deleted successfully.' });
  };

  // Save all changes (update displayOrder and metadata for existing items)
  const handleSaveAll = async () => {
    setSaving(true);

    try {
      for (let i = 0; i < highlights.length; i++) {
        const item = highlights[i];
        if (item.id && !item.id.startsWith('temp-')) {
          await fetch(`/api/admin/highlights/${item.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              alt: item.alt,
              title: item.title,
              displayOrder: i
            })
          });
        }
      }
      setInitialHighlights([...highlights]);
      showNotification({ type: 'success', text: 'Company Highlights saved successfully!' });
    } catch (err: any) {
      showNotification({ type: 'error', text: err.message || 'Failed to save highlights' });
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalImages = highlights.length;
  const estimatedStorage = (totalImages * 1.2).toFixed(1);
  const validFilesCount = modalFiles.filter((f) => f.isValid && f.status !== 'success').length;
  const invalidFilesCount = modalFiles.filter((f) => !f.isValid).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans pb-32">
      {/* Hidden File Input for Multi-Image Upload (Always mounted in DOM) */}
      <input
        ref={modalFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleModalFilesSelect(e.target.files);
            setIsUploadModalOpen(true);
          }
          e.target.value = '';
        }}
      />

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
            Manage images displayed in Company Highlights gallery section.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (modalFiles.length > 0) {
                setIsUploadModalOpen(true);
              } else {
                modalFileInputRef.current?.click();
              }
            }}
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

      {/* Auto-Dismissing Notification Banner */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium animate-in fade-in transition-all ${
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
          <button
            onClick={() => {
              if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
              setMessage(null);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= GALLERY COLLECTION GRID ================= */}
      {highlights.length > 0 ? (
        <div className="space-y-4">
          {/* Gallery Header Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-4">
              {/* If Selection Mode is ON, show Select All Checkbox */}
              {isSelectionMode ? (
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-[#00A79D] border-slate-300 focus:ring-[#00A79D] cursor-pointer"
                  />
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    Select All ({highlights.length})
                  </span>
                </label>
              ) : (
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  GALLERY COLLECTION ({highlights.length})
                </span>
              )}

              {/* Selection Counter Badge */}
              {isSelectionMode && isSomeSelected && (
                <span className="px-2.5 py-1 text-[11px] font-bold bg-teal-50 text-[#00A79D] border border-teal-200/80 rounded-full animate-in fade-in">
                  {selectedIds.length} of {highlights.length} selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Bulk Delete Button when items selected */}
              {isSelectionMode && isSomeSelected && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer animate-in fade-in"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedIds.length})</span>
                </button>
              )}

              {/* Toggle "Select Images" Button */}
              {!isSelectionMode ? (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">Drag cards to reorder</span>
                  <button
                    onClick={() => setIsSelectionMode(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <CheckSquareIcon className="w-3.5 h-3.5 text-[#00A79D]" />
                    <span>Select Images</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedIds([]);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <CloseIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cancel Selection</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => {
              const isChecked = item.id ? selectedIds.includes(item.id) : false;

              return (
                <div
                  key={item.id || index}
                  draggable={!isSelectionMode}
                  onDragStart={() => !isSelectionMode && handleDragStart(index)}
                  onDragOver={(e) => !isSelectionMode && handleDragOver(e, index)}
                  className={`relative group bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl ${
                    isChecked
                      ? 'border-[#00A79D] ring-2 ring-[#00A79D]/40 bg-teal-50/10'
                      : 'border-slate-200/80 hover:border-[#00A79D] hover:-translate-y-1'
                  }`}
                >
                  {/* Top Header: Checkbox (only when in Selection Mode), Drag Handle & Menu */}
                  <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
                    {/* Corner Checkbox - Only rendered when Selection Mode is ON */}
                    {isSelectionMode ? (
                      <label
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-xl bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors cursor-pointer flex items-center justify-center text-white"
                        title="Select card"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 rounded text-[#00A79D] border-white/60 focus:ring-[#00A79D] cursor-pointer"
                        />
                      </label>
                    ) : (
                      <span
                        className="p-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/60 transition-colors cursor-grab active:cursor-grabbing"
                        title="Drag to reorder"
                      >
                        <GripIcon className="w-3.5 h-3.5" />
                      </span>
                    )}

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
                    onClick={() => {
                      if (isSelectionMode) {
                        toggleSelectItem(item.id);
                      } else {
                        setPreviewItem(item);
                      }
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.alt || 'Highlight Image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-bold flex items-center gap-1.5">
                        {isSelectionMode ? (
                          isChecked ? 'Selected (Click to deselect)' : 'Click to select'
                        ) : (
                          <>
                            <EyeIcon className="w-3.5 h-3.5" /> Preview
                          </>
                        )}
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
                      <span>Strict Max 2MB</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
              Upload images using the Upload Images button above to display in the Company Highlights gallery. Select multiple images at once!
            </p>
          </div>
        </div>
      )}

      {/* ================= MULTI-IMAGE UPLOAD MODAL DIALOG ================= */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (!isUploadingModal) {
              clearModalFiles();
              setIsUploadModalOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <UploadIcon className="w-5 h-5 text-[#00A79D]" />
                  Upload Multiple Company Highlights
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select multiple images at once (Hold Ctrl/Cmd or Shift in file window). Max 2MB per image.
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isUploadingModal) {
                    clearModalFiles();
                    setIsUploadModalOpen(false);
                  }
                }}
                disabled={isUploadingModal}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 disabled:opacity-40"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              {/* Drag & Drop File Picker Box */}
              <div
                onClick={() => !isUploadingModal && modalFileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isUploadingModal && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleModalFilesSelect(e.dataTransfer.files);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                  isUploadingModal
                    ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
                    : 'border-slate-200 hover:border-[#00A79D] bg-slate-50/50 hover:bg-teal-50/20'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 text-[#00A79D] group-hover:bg-[#00A79D] group-hover:text-white flex items-center justify-center transition-colors">
                  <UploadIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to <span className="text-[#00A79D] underline">Browse & Select Multiple Images</span> or Drag & Drop
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, WEBP, SVG • Strict 2MB max size per image
                  </p>
                </div>
              </div>

              {/* Single Dialog Banner for File Format / Size Error */}
              {modalError && (
                <div className="flex items-start justify-between gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-extrabold text-rose-900">File Validation Alert</h5>
                      <p className="text-xs font-semibold text-rose-700 leading-relaxed whitespace-pre-line mt-0.5">
                        {modalError}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalError(null)}
                    className="text-rose-400 hover:text-rose-600 p-0.5 shrink-0"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Live Upload Progress Indicator */}
              {uploadProgress && (
                <div className="space-y-2 p-4 bg-teal-50 border border-teal-200 rounded-2xl animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-[#00A79D]">
                    <span className="flex items-center gap-2">
                      <LoaderIcon className="w-4 h-4 animate-spin text-[#00A79D]" />
                      Uploading & Saving image {uploadProgress.current} of {uploadProgress.total}...
                    </span>
                    <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono truncate">
                    File: {uploadProgress.currentFileName}
                  </p>
                  <div className="w-full bg-teal-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#00A79D] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Selected Files Queue List */}
              {modalFiles.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Upload Queue ({modalFiles.length})
                      </h4>
                      {validFilesCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                          {validFilesCount} valid
                        </span>
                      )}
                      {invalidFilesCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-full">
                          {invalidFilesCount} invalid
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {!isUploadingModal && invalidFilesCount > 0 && (
                        <button
                          type="button"
                          onClick={removeInvalidFiles}
                          className="text-[11px] text-rose-600 hover:underline font-bold"
                        >
                          Remove Invalid Files
                        </button>
                      )}
                      {!isUploadingModal && (
                        <button
                          type="button"
                          onClick={() => modalFileInputRef.current?.click()}
                          className="text-[11px] text-[#00A79D] hover:underline font-bold flex items-center gap-1"
                        >
                          <PlusIcon className="w-3 h-3" /> Add More Images
                        </button>
                      )}
                      {!isUploadingModal && (
                        <button
                          type="button"
                          onClick={clearModalFiles}
                          className="text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {modalFiles.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                          !item.isValid
                            ? 'bg-rose-50/50 border-rose-200'
                            : item.status === 'success'
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : item.status === 'uploading'
                            ? 'bg-teal-50/50 border-teal-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                          <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>

                        {/* File Details & Title Input */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              disabled={isUploadingModal}
                              value={item.title}
                              onChange={(e) =>
                                setModalFiles((prev) =>
                                  prev.map((f) => (f.id === item.id ? { ...f, title: e.target.value } : f))
                                )
                              }
                              placeholder="Highlight Title"
                              className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#00A79D] focus:bg-white focus:outline-none rounded px-1 py-0.5 w-full truncate"
                            />
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {item.sizeMB} MB
                            </span>
                          </div>

                          {/* Validation Status Badge */}
                          <div className="flex items-center gap-2 text-[10px]">
                            {item.status === 'uploading' ? (
                              <span className="text-[#00A79D] font-bold flex items-center gap-1">
                                <LoaderIcon className="w-3 h-3 animate-spin" /> Uploading & inserting to DB...
                              </span>
                            ) : item.status === 'success' ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckIcon className="w-3 h-3" /> Uploaded & Saved
                              </span>
                            ) : !item.isValid ? (
                              <span className="text-rose-600 font-bold flex items-center gap-1">
                                <AlertIcon className="w-3 h-3" /> {item.error}
                              </span>
                            ) : item.status === 'error' ? (
                              <span className="text-rose-600 font-bold flex items-center gap-1">
                                <AlertIcon className="w-3 h-3" /> {item.error || 'Failed'}
                              </span>
                            ) : (
                              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckIcon className="w-3 h-3 text-emerald-500" /> Ready to upload (Under 2MB limit)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove File Action */}
                        {!isUploadingModal && item.status !== 'success' && (
                          <button
                            type="button"
                            onClick={() => removeModalFile(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                            title="Remove from queue"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  disabled={isUploadingModal}
                  onClick={() => {
                    clearModalFiles();
                    setIsUploadModalOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingModal || validFilesCount === 0}
                  className="flex-1 py-2.5 rounded-xl bg-[#00A79D] hover:bg-[#008f85] text-white text-xs font-bold shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isUploadingModal ? <LoaderIcon className="w-3.5 h-3.5 animate-spin" /> : <UploadIcon className="w-3.5 h-3.5" />}
                  <span>
                    {isUploadingModal
                      ? 'Uploading...'
                      : validFilesCount > 0
                      ? `Upload ${validFilesCount} Valid Image${validFilesCount > 1 ? 's' : ''}`
                      : 'Upload Images'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BULK DELETE CONFIRMATION MODAL ================= */}
      {isBulkDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !deletingBulk && setIsBulkDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <TrashIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Delete {selectedIds.length} Highlight{selectedIds.length > 1 ? 's' : ''}?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                This will permanently delete {selectedIds.length} selected image(s) from database and Supabase storage.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={deletingBulk}
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={deletingBulk}
                onClick={handleBulkDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingBulk ? <LoaderIcon className="w-3.5 h-3.5 animate-spin" /> : <TrashIcon className="w-3.5 h-3.5" />}
                <span>{deletingBulk ? 'Deleting...' : 'Delete Highlights'}</span>
              </button>
            </div>
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
                  <p className="text-xs font-bold text-slate-700">Strict Max 2MB</p>
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
                This image will be permanently removed from storage and database.
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
