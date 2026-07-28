/**
 * Cleans raw HTML or text content by stripping navigation, footers, scripts,
 * styles, and unneeded tags while preserving structured headings, lists, and text.
 */
export function extractCleanText(htmlOrText: string): string {
  if (!htmlOrText) return '';

  let cleaned = htmlOrText;

  // 1. Remove script, style, svg, noscript, nav, footer, header tags and their contents
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  cleaned = cleaned.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');
  cleaned = cleaned.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');
  cleaned = cleaned.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');
  cleaned = cleaned.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ');

  // 2. Replace structural tags with line breaks
  cleaned = cleaned.replace(/<\/(h[1-6]|p|div|li|tr|br|section|article)>/gi, '\n');
  cleaned = cleaned.replace(/<(h[1-6]|p|div|li|tr|br|section|article)[^>]*>/gi, '\n');

  // 3. Strip all remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // 4. Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–');

  // 5. Clean up multiple spaces and empty lines
  const lines = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.join('\n');
}
