import { NextResponse } from 'next/server';
import { fetchPhases } from '@/lib/notion';

export async function GET() {
  try {
    const phases = await fetchPhases();
    return NextResponse.json(phases);
  } catch (error) {
    console.error('Error fetching phases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phases' },
      { status: 500 }
    );
  }
} 