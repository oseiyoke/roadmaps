import { NextRequest, NextResponse } from 'next/server';
import { fetchPhaseContent } from '@/lib/notion';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await fetchPhaseContent(id);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching phase content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phase content' },
      { status: 500 }
    );
  }
} 