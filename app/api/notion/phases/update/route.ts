import { NextRequest } from 'next/server';
import { updatePhase } from '@/lib/notion-phases';
import { errorResponse, successResponse, validateRequired } from '@/lib/api-utils';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { phaseId, title } = body;
    
    // Validate required fields
    const validation = validateRequired(body, ['phaseId', 'title']);
    if (!validation.valid) {
      return errorResponse(
        `Missing required fields: ${validation.missing?.join(', ')}`,
        400
      );
    }

    // Update the phase
    await updatePhase(phaseId, { title });

    return successResponse();
  } catch (error) {
    console.error('Error updating phase:', error);
    return errorResponse('Failed to update phase');
  }
} 