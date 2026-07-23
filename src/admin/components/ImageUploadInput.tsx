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

    // Client-side validation: Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please choose a smaller image.');
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
          Supabase Bucket • Max 5MB
        </span>
      </div>

      {/* Main Container */}
      <div className="space-y-3">
        {/* Upload Action & URL Input Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* File Upload Trigger Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-[#002B49] text-[#002B49] hover:text-white border border-slate-200 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#FDB913]" />
            ) : (
              <UploadCloud className="w-4 h-4 text-[#FDB913]" />
            )}
            <span>{uploading ? 'Uploading to Supabase...' : 'Choose & Upload Image'}</span>
          </button>

          {/* Text Input for URL */}
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all disabled:opacity-75"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                disabled={disabled}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-red-500 transition-colors"
                title="Clear image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="flex items-center gap-2 text-[11px] font-medium text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Image Preview Box */}
        {value && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">Image Preview</p>
              <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{value}</p>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-[#002B49] transition-colors"
              title="Open image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
