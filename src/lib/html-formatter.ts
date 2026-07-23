/**
 * Smart HTML Auto-Formatter & Sanitizer Utility for YF CMS
 */

// Converts plain text (Notepad, raw copy-paste, ChatGPT) into clean semantic HTML
export function convertPlainTextToSemanticHtml(text: string): string {
  if (!text || !text.trim()) return '';

  const trimmed = text.trim();

  // If already contains HTML tags (like <p>, <h2>, <ul>), run paste cleaner & style injector
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return cleanAndSanitizeHtml(trimmed);
  }

  // Split content into lines
  const lines = trimmed.split(/\r?\n/);
  const blocks: string[] = [];
  
  let inUl = false;
  let inOl = false;
  let currentListItems: string[] = [];

  const closeActiveLists = () => {
    if (inUl && currentListItems.length > 0) {
      blocks.push(
        `<ul class="list-disc pl-6 space-y-1.5 my-4 text-slate-800 font-sans">\n${currentListItems
          .map((item) => `  <li class="leading-relaxed">${item}</li>`)
          .join('\n')}\n</ul>`
      );
      currentListItems = [];
      inUl = false;
    }
    if (inOl && currentListItems.length > 0) {
      blocks.push(
        `<ol class="list-decimal pl-6 space-y-1.5 my-4 text-slate-800 font-sans">\n${currentListItems
          .map((item) => `  <li class="leading-relaxed">${item}</li>`)
          .join('\n')}\n</ol>`
      );
      currentListItems = [];
      inOl = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      closeActiveLists();
      continue;
    }

    // Check for unordered list item (-, *, •, –, —, ›, »)
    const ulMatch = line.match(/^[-*•–—›»]\s+(.+)/);
    if (ulMatch) {
      if (inOl) closeActiveLists();
      inUl = true;
      currentListItems.push(formatInlineLinks(ulMatch[1]));
      continue;
    }

    // Check for ordered list item (1., 2., 1), etc.)
    const olMatch = line.match(/^\d+[\.\)]\s+(.+)/);
    if (olMatch) {
      if (inUl) closeActiveLists();
      inOl = true;
      currentListItems.push(formatInlineLinks(olMatch[1]));
      continue;
    }

    // Close any open lists before non-list content
    closeActiveLists();

    // Check for Headings:
    // 1. Markdown style: # Heading, ## Heading, ### Heading
    const mdHeaderMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (mdHeaderMatch) {
      const level = mdHeaderMatch[1].length === 1 ? 'h2' : 'h3';
      const tagClass = level === 'h2' ? 'text-2xl font-bold font-serif text-[#002B49] mt-8 mb-4' : 'text-xl font-bold font-serif text-[#002B49] mt-6 mb-3';
      blocks.push(`<${level} class="${tagClass}">${formatInlineLinks(mdHeaderMatch[2])}</${level}>`);
      continue;
    }

    // 2. Standalone short line (<= 80 chars) ending with ":" or Title Case short lines without period
    const isHeadingByColon = line.endsWith(':') && line.length <= 80;
    const isShortTitleHeader = 
      line.length <= 45 && 
      !/[.!?]$/.test(line) && 
      i + 1 < lines.length && 
      lines[i + 1].trim().length > 0 &&
      (i === 0 || lines[i - 1].trim() === '');

    if (isHeadingByColon || isShortTitleHeader) {
      const cleanHeading = line.replace(/:$/, '').trim();
      const tag = line.length <= 35 || isHeadingByColon ? 'h2' : 'h3';
      const tagClass = tag === 'h2' ? 'text-2xl font-bold font-serif text-[#002B49] mt-8 mb-4' : 'text-xl font-bold font-serif text-[#002B49] mt-6 mb-3';
      blocks.push(`<${tag} class="${tagClass}">${formatInlineLinks(cleanHeading)}</${tag}>`);
      continue;
    }

    // Normal Paragraph
    blocks.push(`<p class="leading-relaxed text-slate-800 mb-4">${formatInlineLinks(line)}</p>`);
  }

  closeActiveLists();

  return cleanAndSanitizeHtml(blocks.join('\n\n'));
}

// Converts URLs, Email addresses, and Phone numbers into clickable hyper-links
export function formatInlineLinks(input: string): string {
  if (!input) return '';

  let output = input;

  // Auto-link URLs (excluding URLs already inside href="..." or src="...")
  output = output.replace(
    /(?<!href="|src="|">)(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#00A79D] underline font-medium hover:text-[#002B49] transition-colors">$1</a>'
  );

  // Auto-link Email addresses
  output = output.replace(
    /(?<!mailto:|\w)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![^<]*>)/g,
    '<a href="mailto:$1" class="text-[#00A79D] underline font-medium hover:text-[#002B49] transition-colors">$1</a>'
  );

  // Auto-link Phone numbers (e.g. +91 99999 99999 or +1-800-555-0199)
  output = output.replace(
    /(?<!tel:|\d)(\+\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})(?![^<]*>)/g,
    (match) => {
      const cleanPhone = match.replace(/[^+\d]/g, '');
      return `<a href="tel:${cleanPhone}" class="text-[#00A79D] underline font-medium hover:text-[#002B49] transition-colors">${match}</a>`;
    }
  );

  return output;
}

// Clean unwanted Word/Google Docs styles, script tags, empty paragraphs, and preserve semantic HTML
export function cleanAndSanitizeHtml(html: string): string {
  if (!html) return '';

  let cleaned = html;

  // 1. Remove dangerous script and iframe tags (XSS Prevention)
  cleaned = cleaned.replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '');
  cleaned = cleaned.replace(/<iframe\b[^<]*>([\s\S]*?)<\/iframe>/gi, '');
  cleaned = cleaned.replace(/\s*on\w+="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s*on\w+='[^']*'/gi, '');
  cleaned = cleaned.replace(/href="javascript:[^"]*"/gi, 'href="#"');

  // 2. Strip Microsoft Word / Office XML comments & metadata
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  cleaned = cleaned.replace(/<\/?(meta|link|style|xml|w:[^>]+|o:[^>]+)[^>]*>/gi, '');

  // 3. Remove inline styles & font classes from Word/Google Docs (e.g. style="font-family: Arial; color: red;")
  cleaned = cleaned.replace(/\s+style="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s+style='[^']*'/gi, '');

  // 4. Unwrap useless <span> tags
  cleaned = cleaned.replace(/<span>([\s\S]*?)<\/span>/gi, '$1');
  cleaned = cleaned.replace(/<span\s*\/?>/gi, '');

  // 5. Clean up empty paragraphs or paragraph spaces like <p>&nbsp;</p> or <p></p>
  cleaned = cleaned.replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<div>\s*(&nbsp;)?\s*<\/div>/gi, '');

  // 6. Ensure <ul> and <ol> have bullet and list styling classes if unstyled
  cleaned = cleaned.replace(/<ul>/gi, '<ul class="list-disc pl-6 space-y-1.5 my-4 text-slate-800 font-sans">');
  cleaned = cleaned.replace(/<ol>/gi, '<ol class="list-decimal pl-6 space-y-1.5 my-4 text-slate-800 font-sans">');

  // 7. Ensure <li> tags have clean leading line height if unstyled
  cleaned = cleaned.replace(/<li>(?!\s*class=)/gi, '<li class="leading-relaxed">');

  // 8. Ensure clickable links have target="_blank"
  cleaned = cleaned.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/gi,
    (match, href, rest) => {
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer"${rest.replace(/target="[^"]*"/gi, '').replace(/rel="[^"]*"/gi, '')}>`;
      }
      return match;
    }
  );

  return cleaned.trim();
}
