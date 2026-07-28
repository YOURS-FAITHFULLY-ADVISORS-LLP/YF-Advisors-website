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
  Eye, 
  Edit3, 
  Wand2, 
  Code,
  Sparkles,
  Type
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
  placeholder = 'Type or paste content from Word, ChatGPT, Google Docs...',
  rows = 10,
  showPreviewTab = true,
}: RichTextEditorProps) {
  // Mode: 'visual' (WYSIWYG live visual editing for non-tech admins), 'code' (HTML view for devs), 'preview' (Live website render)
  const [mode, setMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const [autoFormattedBanner, setAutoFormattedBanner] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const isInternalChangeRef = useRef(false);

  // Synchronize visualRef innerHTML when value changes from outside or mode changes
  useEffect(() => {
    if (mode === 'visual' && visualRef.current) {
      if (!isInternalChangeRef.current && visualRef.current.innerHTML !== value) {
        visualRef.current.innerHTML = value || '';
      }
      isInternalChangeRef.current = false;
    }
  }, [value, mode]);

  // Visual ContentEditable input handler
  const handleVisualInput = () => {
    if (visualRef.current) {
      isInternalChangeRef.current = true;
      const html = visualRef.current.innerHTML;
      onChange(html);
    }
  };

  // Visual ContentEditable paste handler
  const handleVisualPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const pastedHtml = e.clipboardData.getData('text/html');
    const pastedText = e.clipboardData.getData('text/plain');

    let processedContent = '';

    if (pastedHtml && pastedHtml.trim()) {
      processedContent = cleanAndSanitizeHtml(pastedHtml);
    } else if (pastedText && pastedText.trim()) {
      processedContent = convertPlainTextToSemanticHtml(pastedText);
    }

    if (!processedContent) return;

    // Insert processed HTML at current cursor position
    document.execCommand('insertHTML', false, processedContent);
    handleVisualInput();

    setAutoFormattedBanner(true);
    setTimeout(() => setAutoFormattedBanner(false), 4000);
  };

  // Textarea Paste Handler (for Code mode)
  const handleCodePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const pastedHtml = e.clipboardData.getData('text/html');
    const pastedText = e.clipboardData.getData('text/plain');

    let processedContent = '';

    if (pastedHtml && pastedHtml.trim()) {
      processedContent = cleanAndSanitizeHtml(pastedHtml);
    } else if (pastedText && pastedText.trim()) {
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
    if (visualRef.current) {
      visualRef.current.innerHTML = formatted;
    }
    setAutoFormattedBanner(true);
    setTimeout(() => setAutoFormattedBanner(false), 3000);
  };

  // Universal formatting helper for Visual (execCommand) and Code (textarea tags) modes
  const executeFormatting = (
    command: string, 
    commandValue?: string, 
    codeOpenTag?: string, 
    codeCloseTag?: string,
    defaultText: string = 'text'
  ) => {
    if (mode === 'visual') {
      if (visualRef.current) {
        visualRef.current.focus();
        document.execCommand(command, false, commandValue);
        handleVisualInput();
      }
    } else if (mode === 'code' && textareaRef.current && codeOpenTag && codeCloseTag) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end) || defaultText;
      const replacement = `${codeOpenTag}${selected}${codeCloseTag}`;
      const updated = value.substring(0, start) + replacement + value.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + codeOpenTag.length, start + codeOpenTag.length + selected.length);
      }, 0);
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter website link URL:', 'https://');
    if (!url || !url.trim()) return;

    if (mode === 'visual') {
      executeFormatting('createLink', url.trim());
    } else {
      executeFormatting('', '', `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">`, '</a>', 'link text');
    }
  };

  const handleAddImage = () => {
    const src = prompt('Enter image URL:', 'https://');
    if (!src || !src.trim()) return;
    const alt = prompt('Enter image caption:', 'Image description') || '';
    const imgHtml = `<figure class="my-6">\n  <img src="${src.trim()}" alt="${alt}" class="w-full rounded-2xl border border-slate-200 shadow-md" />\n  ${alt ? `<figcaption class="text-center text-xs text-slate-500 mt-2 font-medium">${alt}</figcaption>` : ''}\n</figure>`;
    
    if (mode === 'visual') {
      if (visualRef.current) {
        visualRef.current.focus();
        document.execCommand('insertHTML', false, imgHtml);
        handleVisualInput();
      }
    } else {
      executeFormatting('', '', imgHtml, '', '');
    }
  };

  const handleAddTable = () => {
    const tableHtml = `
<div class="overflow-x-auto my-6 border border-slate-200 rounded-2xl shadow-2xs">
  <table class="w-full text-sm text-left border-collapse bg-white">
    <thead class="bg-slate-100/90 text-[#002B49] font-bold text-xs uppercase tracking-wider border-b border-slate-200">
      <tr>
        <th class="p-3 border-r border-slate-200 last:border-r-0">Header 1</th>
        <th class="p-3 border-r border-slate-200 last:border-r-0">Header 2</th>
        <th class="p-3 border-r border-slate-200 last:border-r-0">Header 3</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 text-slate-700">
      <tr class="hover:bg-slate-50/60 transition-colors">
        <td class="p-3 border-r border-slate-200 last:border-r-0 font-medium">Feature A</td>
        <td class="p-3 border-r border-slate-200 last:border-r-0">Details / Standard</td>
        <td class="p-3 border-r border-slate-200 last:border-r-0">Included</td>
      </tr>
      <tr class="hover:bg-slate-50/60 transition-colors bg-slate-50/30">
        <td class="p-3 border-r border-slate-200 last:border-r-0 font-medium">Feature B</td>
        <td class="p-3 border-r border-slate-200 last:border-r-0">Details / Premium</td>
        <td class="p-3 border-r border-slate-200 last:border-r-0">Included</td>
      </tr>
    </tbody>
  </table>
</div>`.trim();

    if (mode === 'visual') {
      if (visualRef.current) {
        visualRef.current.focus();
        document.execCommand('insertHTML', false, tableHtml);
        handleVisualInput();
      }
    } else {
      executeFormatting('', '', tableHtml + '\n', '', '');
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {label && (
          <label className="block text-xs font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#00A79D]" />
            <span>{label}</span>
          </label>
        )}

        <div className="flex items-center gap-2">
          {/* Editor Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
            {/* 1. Visual Editor Tab (WYSIWYG for non-tech admins) */}
            <button
              type="button"
              onClick={() => setMode('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'visual'
                  ? 'bg-white text-[#002B49] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Visual WYSIWYG Editor (No coding required)"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#00A79D]" />
              <span>Visual Editor</span>
            </button>

            {/* 2. Raw HTML Code View (For power users) */}
            <button
              type="button"
              onClick={() => setMode('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'code'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View or Edit raw HTML tags"
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>HTML Code</span>
            </button>

            {/* 3. Live Preview Tab */}
            {showPreviewTab && (
              <button
                type="button"
                onClick={() => setMode('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'preview'
                    ? 'bg-[#002B49] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Preview full rendered webpage style"
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
          <span>Content formatted into clean visual layout!</span>
        </div>
      )}

      {/* Editor Container */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        {mode !== 'preview' && (
          <>
            {/* Rich Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
              {/* Headings */}
              <button
                type="button"
                onClick={() => executeFormatting('formatBlock', '<h2>', '<h2>', '</h2>', 'Heading 2')}
                className="px-2.5 py-1.5 hover:bg-slate-200 rounded-lg text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                title="Heading 2 (H2)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => executeFormatting('formatBlock', '<h3>', '<h3>', '</h3>', 'Heading 3')}
                className="px-2.5 py-1.5 hover:bg-slate-200 rounded-lg text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                title="Heading 3 (H3)"
              >
                H3
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Bold, Italic, Underline */}
              <button
                type="button"
                onClick={() => executeFormatting('bold', undefined, '<strong>', '</strong>', 'bold text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeFormatting('italic', undefined, '<em>', '</em>', 'italic text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeFormatting('underline', undefined, '<u>', '</u>', 'underlined text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Bullet List & Numbered List */}
              <button
                type="button"
                onClick={() => executeFormatting('insertUnorderedList', undefined, '<ul>\n  <li>', '</li>\n</ul>', 'List item')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Unordered Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeFormatting('insertOrderedList', undefined, '<ol>\n  <li>', '</li>\n</ol>', 'Numbered item')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Ordered Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeFormatting('formatBlock', 'blockquote', '<blockquote class="border-l-4 border-[#002B49] pl-4 italic my-4 text-slate-600">\n  ', '\n</blockquote>', 'Quote text')}
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
                title="Insert Table Format"
              >
                <TableIcon className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-300 mx-1" />

              {/* Alignments */}
              <button
                type="button"
                onClick={() => executeFormatting('justifyLeft', undefined, '<div class="text-left">', '</div>', 'left text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeFormatting('justifyCenter', undefined, '<div class="text-center">', '</div>', 'centered text')}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeFormatting('justifyRight', undefined, '<div class="text-right">', '</div>', 'right text')}
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
                  title="Auto-format plain text into clean styled text & headings"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#FDB913]" />
                  <span>Auto-Format Visual</span>
                </button>
              </div>
            </div>

            {/* 1. MODE: VISUAL WYSIWYG EDITOR (For non-tech admin users) */}
            {mode === 'visual' && (
              <div className="relative p-4 bg-white min-h-[220px]">
                <div
                  ref={visualRef}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={handleVisualInput}
                  onPaste={handleVisualPaste}
                  className="w-full min-h-[200px] text-slate-900 text-sm leading-relaxed focus:outline-none bg-white font-sans prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#002B49] prose-a:text-[#00A79D] prose-img:rounded-2xl"
                />
                {(!value || !value.trim()) && (
                  <div className="absolute top-4 left-4 text-slate-400 text-sm font-medium pointer-events-none select-none italic">
                    {placeholder}
                  </div>
                )}
              </div>
            )}

            {/* 2. MODE: RAW HTML CODE VIEW (For power users) */}
            {mode === 'code' && (
              <textarea
                ref={textareaRef}
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPaste={handleCodePaste}
                placeholder="Raw HTML code editor..."
                className="w-full p-4 border-0 text-slate-900 font-mono text-xs leading-relaxed focus:outline-none bg-slate-900 text-slate-100 transition-all"
              />
            )}
          </>
        )}

        {/* 3. MODE: LIVE WEBSITE PREVIEW */}
        {mode === 'preview' && (
          <div className="p-6 bg-white min-h-[300px] max-w-none">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <span>Live Website Preview</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Live Rendered Output
              </span>
            </div>

            {value && value.trim() ? (
              <div
                className="text-slate-800 text-sm leading-relaxed space-y-4 font-sans prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-[#002B49] prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: cleanAndSanitizeHtml(value) }}
              />
            ) : (
              <p className="text-xs text-slate-400 italic py-8 text-center">
                No content entered yet. Switch to Visual Editor to start typing.
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 pt-1">
        <Sparkles className="w-3 h-3 text-[#00A79D]" />
        <span>Non-technical admins can type and edit directly in <strong>Visual Editor</strong> without knowing code. Switch to <strong>HTML Code</strong> only if you want raw code tags.</span>
      </p>
    </div>
  );
}
