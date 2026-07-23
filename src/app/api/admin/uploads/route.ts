import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided in form data.' },
        { status: 400 }
      );
    }

    // Check size limit (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds max 5MB limit.' },
        { status: 400 }
      );
    }

    // Check image type (must be image/*)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files (JPEG, PNG, WebP, GIF, SVG, etc.) are allowed.' },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Sanitize filename and create storage path
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = file.name
      .substring(0, file.name.lastIndexOf('.'))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const storagePath = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError);
      return NextResponse.json(
        { success: false, message: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully to Supabase Storage',
      data: {
        url: publicUrl,
        name: file.name,
        size: file.size,
        path: storagePath,
      },
    });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error uploading file' },
      { status: 500 }
    );
  }
}
