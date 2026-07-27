import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getAdminSession } from '@/src/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.highlight.findUnique({
      where: { id },
    });

    if (existing && existing.src) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const bucket = process.env.SUPABASE_BUCKET || 'uploads';
        
        // Extract relative storage path from URL if it's a Supabase URL
        if (existing.src.includes(`/storage/v1/object/public/${bucket}/`)) {
          const path = existing.src.split(`/storage/v1/object/public/${bucket}/`)[1];
          if (path) {
            await supabase.storage.from(bucket).remove([path]);
          }
        }
      } catch (storageErr) {
        console.error('Supabase File Delete Error:', storageErr);
      }
    }

    await prisma.highlight.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Highlight deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete Highlight Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete highlight' },
      { status: 500 }
    );
  }
}
