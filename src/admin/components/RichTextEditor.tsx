'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Table as TableIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sparkles, 
  Eye, 
  Edit3, 
  Check, 
  Wand2, 
  Code
} from 'lucide-react';
import { convertPlainTextToSemanticHtml, cleanAndSanitizeHtml } from '@/src/lib/html-formatter';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  showPreviewTab?: boolean;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Type or paste content from ChatGPT, Word, Google Docs...',
  rows = 10,
  showPreviewTab = true,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<'editor' | 'preview'>('editor');
  const [autoFormattedBanner, setAutoFormattedBanner] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Smart Paste Handler: Converts pasted text into clean structured HTML
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const pastedHtml = e.clipboardData.getData('text/html');
    const pastedText = e.clipboardData.getData('text/plain');

    let processedContent = '';

    if (pastedHtml && pastedHtml.trim()) {
      // If html is pasted (Word, Google Docs), clean styles and sanitize
      processedContent = cleanAndSanitizeHtml(pastedHtml);
    } else if (pastedText && pastedText.trim()) {
      // If plain text is pasted (ChatGPT, Notepad), auto-structure into headings, lists, p, links
      processedContent = convertPlainTextToSemanticHtml(pastedText);
    }

    if (!processedContent) return;

    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(processedContent);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = value.substring(0, start) + processedContent + value.substring(end);
    onChange(updated);

    setAutoFormattedBanner(true);
    setTimeout(() => setAutoFormattedBanner(false), 4000);
  };

  // One-click Auto Format Trigger
  const handleAutoFormatClick = () => {
    if (!value || !value.trim()) return;
    const formatted = convertPlainTextToSemanticHtml(value);
    onChange(formatted);
    setAutoFormattedBanner(true);
    setTimeout(() => setAutoFormattedBanner(false), 3000);
  };

  // Toolbar Formatting helper
  const insertTag = (
    openTag: string, 
    closeTag: string, 
    defaultText: string = 'text'
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${openTag}${selected}${closeTag}`;
    const updated = value.substring(0, start) + replacement + value.substring(end);
    
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 0);
  };

  const handleAddLink = () => {
    const url = prompt('Enter website link URL:', 'https://');
    if (!url || !url.trim()) return;
    insertTag(`<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">`, '</a>', 'link text');
  };

  const handleAddImage = () => {
    const src = prompt('Enter image URL:', 'https://');
    if (!src || !src.trim()) return;
    const alt = prompt('Enter image description/caption:', 'Image description') || '';
    const imgHtml = `<figure class="my-6">\n  <img src="${src.trim()}" alt="${alt}" class="w-full rounded-2xl border border-slate-200 shadow-md" />\n  ${alt ? `<figcaption class="text-center text-xs text-slate-500 mt-2 font-medium">${alt}</figcaption>` : ''}\n</figure>`;
    
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + '\n\n' + imgHtml);
      return;
    }
    const start = textarea.selectionStart;
    const updated = value.substring(0, start) + '\n\n' + imgHtml + '\n\n' + value.substring(start);
    onChange(updated);
  };

  const handleAddTable = () => {
    const tableHtml = `
<table className="w-full border-collapse border border-slate-200 my-4 text-xs">
  <thead>
    <tr className="bg-slate-100 font-bold text-[#002B49]">
      <th className="border border-slate-200 p-2 text-left">Header 1</th>
      <th className="border border-slate-200 p-2 text-left">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-slate-200 p-2">Data 1</td>
      <td className="border border-slate-200 p-2">Data 2</td>
    </tr>
  </tbody>
</table>`.trim();

    insertTag(tableHtml + '\n', '', '');
  };

  return (
    <div className="space-y-2">
      {/* Label and Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {label && (
          <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="flex items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'editor'
                  ? 'bg-white text-[#002B49] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>

            {showPreviewTab && (
              <button
                type="button"
                onClick={() => setMode('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'preview'
                    ? 'bg-[#002B49] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#FDB913]" />
                <span>Live Preview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auto-Formatted Notification Banner */}
      {autoFormattedBanner && (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Content automatically converted into clean, semantic HTML!</span>
        </div>
      )}

      {/* Editor Main Container */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        {mode !== 'preview' && (
          <>
            {/* Rich Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
              {/* Headings */}
              <button
                type="button"
                onClick={() => insertTag('<h2>', '</h2>', 'Heading 2')}
                className="px-2.5 py-1.5 hover:bg-slate-200 rounded-lg text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                title="Heading 2 (H2)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertTag('<h3>', '</h3>', 'Heading 3')}
                className="px-2.5 py-1.5 hover:bg-slate-200 rounded-lg text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                title="Heading 3 (H3)"
              >
                H3
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Bold, Italic, Underline */}
              <button
                type="button"
                onClick={() => insertTag('<strong>', '</strong>', 'bold text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTag('<em>', '</em>', 'italic text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTag('<u>', '</u>', 'underlined text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Bullet List & Numbered List */}
              <button
                type="button"
                onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>', 'List item')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Unordered Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>', 'Numbered item')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Ordered Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTag('<blockquote class="border-l-4 border-[#002B49] pl-4 italic my-4 text-slate-600">\n  ', '\n</blockquote>', 'Quote text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Links, Images, Tables */}
              <button
                type="button"
                onClick={handleAddLink}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleAddImage}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleAddTable}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Insert Table"
              >
                <TableIcon className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Alignments */}
              <button
                type="button"
                onClick={() => insertTag('<div class="text-left">', '</div>', 'left text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTag('<div class="text-center">', '</div>', 'centered text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTag('<div class="text-right">', '</div>', 'right text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              {/* Magic One-Click Auto-Format Button */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoFormatClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  title="Auto-detect plain text and convert to clean HTML"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#FDB913]" />
                  <span>Auto-Format HTML</span>
                </button>
              </div>
            </div>

            {/* Textarea Input */}
            <textarea
              ref={textareaRef}
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onPaste={handlePaste}
              placeholder={placeholder}
              className="w-full p-4 border-0 text-slate-900 text-sm font-medium focus:outline-none bg-white transition-all"
            />
          </>
        )}

        {/* Live Website Preview Mode */}
        {mode === 'preview' && (
          <div className="p-6 bg-white min-h-[300px] max-w-none">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <span>Live Website Preview</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                HTML Rendered
              </span>
            </div>

            {value && value.trim() ? (
              <div
                className="text-slate-800 text-sm leading-relaxed space-y-4 font-sans prose prose-slate max-w-none prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: cleanAndSanitizeHtml(value) }}
              />
            ) : (
              <p className="text-xs text-slate-400 italic py-8 text-center">
                No content entered yet. Type or paste text to see the live preview.
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 font-medium">
        Tip: You can paste content directly from Word, ChatGPT, Google Docs, or Notepad. It will automatically convert to clean semantic HTML.
      </p>
    </div>
  );
}
