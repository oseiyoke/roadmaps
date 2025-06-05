import { NextRequest, NextResponse } from 'next/server';
import { fetchPhaseTasks } from '@/lib/notion';

export async function GET(
  request: NextRequest,
  { params }: { params: { phaseTitle: string } }
) {
  try {
    const phaseId = params.phaseTitle;
    const tasks = await fetchPhaseTasks(phaseId);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
} 