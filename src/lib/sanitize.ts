/**
 * Recursively sanitizes request input values:
 * - Trims whitespace from strings
 * - Converts empty string values to null when requested or leaves clean trimmed string
 * - Normalizes URLs
 */
export function sanitizeString(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function sanitizeInput<T = any>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return data.trim() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInput(item)) as unknown as T;
  }

  if (typeof data === 'object' && !(data instanceof Date)) {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (typeof value === 'string') {
        sanitizedObj[key] = value.trim();
      } else {
        sanitizedObj[key] = sanitizeInput(value);
      }
    }
    return sanitizedObj as T;
  }

  return data;
}

export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
