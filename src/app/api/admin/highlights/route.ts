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
