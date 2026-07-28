import { TextChunk } from './types';

interface ChunkOptions {
  minSize?: number;
  maxSize?: number;
  overlap?: number;
}

/**
 * Splits extracted clean page text into chunks of 500-800 characters with 100 characters overlap,
 * attempting to preserve sentence and paragraph boundaries.
 */
export function chunkText(
  text: string,
  pageUrl: string,
  pageTitle: string,
  options: ChunkOptions = {}
): TextChunk[] {
  const minSize = options.minSize || 500;
  const maxSize = options.maxSize || 800;
  const overlap = options.overlap || 100;

  if (!text || text.trim().length === 0) {
    return [];
  }

  const cleanContent = text.trim();

  // Short content fits in a single chunk
  if (cleanContent.length <= maxSize) {
    return [
      {
        pageUrl,
        pageTitle,
        chunkIndex: 0,
        content: cleanContent,
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let startIndex = 0;
  let chunkIdx = 0;

  while (startIndex < cleanContent.length) {
    let endIndex = startIndex + maxSize;

    if (endIndex >= cleanContent.length) {
      endIndex = cleanContent.length;
    } else {
      // Find a clean boundary (newline, period, or space) near endIndex
      const searchWindow = cleanContent.substring(startIndex + minSize, endIndex);
      const lastNewline = searchWindow.lastIndexOf('\n');
      const lastPeriod = searchWindow.lastIndexOf('. ');
      const lastSpace = searchWindow.lastIndexOf(' ');

      if (lastNewline !== -1) {
        endIndex = startIndex + minSize + lastNewline + 1;
      } else if (lastPeriod !== -1) {
        endIndex = startIndex + minSize + lastPeriod + 1;
      } else if (lastSpace !== -1) {
        endIndex = startIndex + minSize + lastSpace;
      }
    }

    const chunkContent = cleanContent.substring(startIndex, endIndex).trim();

    if (chunkContent.length > 50) {
      chunks.push({
        pageUrl,
        pageTitle,
        chunkIndex: chunkIdx++,
        content: chunkContent,
      });
    }

    if (endIndex >= cleanContent.length) {
      break;
    }

    // Move start pointer forward by chunk length minus overlap
    const step = Math.max(1, (endIndex - startIndex) - overlap);
    startIndex += step;
  }

  return chunks;
}
