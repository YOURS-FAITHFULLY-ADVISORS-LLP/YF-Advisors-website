import { supabaseAdmin, BUCKET_NAME } from './supabase';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export interface UploadResult {
  url: string;
  path: string;
}

export function validateFile(file: File | Blob, fileName: string): string | null {
  if (!file || file.size === 0) {
    return 'File is empty or missing';
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File size exceeds maximum limit of 10MB';
  }

  const mimeType = file.type;
  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return `Invalid MIME type: ${mimeType}. Allowed types: JPG, PNG, WebP, GIF, SVG`;
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
  if (!ext || !allowedExtensions.includes(ext)) {
    return `Invalid file extension: .${ext}. Allowed extensions: jpg, jpeg, png, webp, gif, svg`;
  }

  return null;
}

export async function uploadToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'cms'
): Promise<UploadResult> {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${folder}/${timestamp}_${sanitizedFileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
  };
}

export async function deleteFromStorage(filePath: string): Promise<boolean> {
  if (!filePath) return false;
  try {
    const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([filePath]);
    return !error;
  } catch {
    return false;
  }
}
