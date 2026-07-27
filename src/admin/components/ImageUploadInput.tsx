'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  folder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  folder = 'uploads',
  required = false,
  disabled = false,
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    // Client-side validation: Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds the 2MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Client-side validation: Any image file type
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image. Please choose an image file (PNG, JPG, WebP, SVG, GIF, etc.).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.url) {
        onChange(data.data.url);
        setSuccess('Image uploaded to Supabase Storage!');
      } else {
        setError(data.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setError('Network error uploading file to server.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-[10px] text-slate-400 font-medium">
          {folder === 'highlights' ? 'Strict Max 2MB' : 'Max 5MB'}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {value ? (
        /* Rich Visual Image Preview Card */
        <div className="relative group rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden p-2 flex items-center gap-4 transition-all hover:shadow-md">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
            <img
              src={value}
              alt="Uploaded file preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Image Uploaded Successfully</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 truncate">
              {value.split('/').pop() || 'Uploaded image'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              Stored in Supabase Storage
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="text-xs font-bold text-[#00A79D] hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${uploading ? 'animate-spin' : ''}`} />
                <span>Replace Image</span>
              </button>
              <span className="text-slate-300">•</span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Full</span>
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            disabled={disabled}
            className="p-2 rounded-full bg-slate-200/80 text-slate-600 hover:bg-rose-500 hover:text-white transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-[#00A79D] bg-slate-50/50 hover:bg-teal-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 group-hover:bg-[#00A79D] text-[#00A79D] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
            {uploading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-[#00A79D] group-hover:text-white transition-colors" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {uploading ? 'Uploading to Supabase Storage...' : 'Click to select & upload image'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PNG, JPG, WebP, SVG • {folder === 'highlights' ? 'Strict 2MB max limit' : '5MB max limit'}
            </p>
          </div>
        </div>
      )}

      {/* Feedback Errors */}
      {error && (
        <div className="flex items-center gap-2 text-[11px] font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
