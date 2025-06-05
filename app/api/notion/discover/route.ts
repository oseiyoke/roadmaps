import { NextRequest, NextResponse } from 'next/server';
import { discoverDatabaseIds } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const { pageUrl } = await request.json();
    
    if (!pageUrl) {
      return NextResponse.json(
        { error: 'Page URL is required' },
        { status: 400 }
      );
    }
    
    const result = await discoverDatabaseIds(pageUrl);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error discovering databases:', error);
    return NextResponse.json(
      { error: 'Failed to discover databases' },
      { status: 500 }
    );
  }
} 