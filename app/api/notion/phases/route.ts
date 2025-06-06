import { fetchPhases } from '@/lib/notion';
import { errorResponse, successResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const phases = await fetchPhases();
    return successResponse(phases);
  } catch (error) {
    console.error('Error fetching phases:', error);
    return errorResponse('Failed to fetch phases');
  }
} 