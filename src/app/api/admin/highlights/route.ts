import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getAdminSession } from '@/src/lib/auth';

// GET public or admin highlights
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    const highlights = await prisma.highlight.findMany({
      where: includeDrafts ? {} : { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: highlights,
    });
  } catch (error: any) {
    console.error('Fetch Highlights Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch highlights' },
      { status: 500 }
    );
  }
}

// POST create highlight
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();

    const body = await req.json();
    const { src, alt, title, displayOrder, status } = body;

    if (!src) {
      return NextResponse.json(
        { success: false, message: 'Image URL (src) is required.' },
        { status: 400 }
      );
    }

    // Prevent duplicate entries for the same image URL
    const existing = await prisma.highlight.findFirst({
      where: { src },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Highlight already exists',
        data: existing,
      });
    }

    const highlight = await prisma.highlight.create({
      data: {
        src,
        alt: alt || '',
        title: title || null,
        displayOrder: typeof displayOrder === 'number' ? displayOrder : (displayOrder ? parseInt(displayOrder, 10) : 0),
        status: status || 'PUBLISHED',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Highlight created successfully',
      data: highlight,
    });
  } catch (error: any) {
    console.error('Create Highlight Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create highlight' },
      { status: 500 }
    );
  }
}

// DELETE bulk or selected highlights
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { ids, all } = body;

    let targetHighlights = [];

    if (all) {
      targetHighlights = await prisma.highlight.findMany({ select: { id: true, src: true } });
    } else if (Array.isArray(ids) && ids.length > 0) {
      targetHighlights = await prisma.highlight.findMany({
        where: { id: { in: ids } },
        select: { id: true, src: true },
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'No highlight IDs provided for deletion.' },
        { status: 400 }
      );
    }

    if (targetHighlights.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No highlights found matching provided IDs.',
        count: 0,
      });
    }

    // Delete associated files from Supabase storage bucket
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const bucket = process.env.SUPABASE_BUCKET || 'uploads';

      const pathsToRemove: string[] = [];
      targetHighlights.forEach((item) => {
        if (item.src && item.src.includes(`/storage/v1/object/public/${bucket}/`)) {
          const path = item.src.split(`/storage/v1/object/public/${bucket}/`)[1];
          if (path) pathsToRemove.push(path);
        }
      });

      if (pathsToRemove.length > 0) {
        await supabase.storage.from(bucket).remove(pathsToRemove);
      }
    } catch (storageErr) {
      console.error('Supabase Bulk File Delete Error:', storageErr);
    }

    // Delete records from Prisma DB
    const idsToDelete = targetHighlights.map((h) => h.id);
    const deleteResult = await prisma.highlight.deleteMany({
      where: { id: { in: idsToDelete } },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.count} highlight(s) from database and storage.`,
      count: deleteResult.count,
    });
  } catch (error: any) {
    console.error('Bulk Delete Highlights Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete highlights' },
      { status: 500 }
    );
  }
}
