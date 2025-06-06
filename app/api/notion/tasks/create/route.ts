import { NextRequest } from 'next/server';
import { createTask } from '@/lib/notion-tasks';
import { errorResponse, successResponse, validateRequired } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phaseId, name, status = 'pending' } = body;
    
    // Validate required fields
    const validation = validateRequired(body, ['phaseId', 'name']);
    if (!validation.valid) {
      return errorResponse(
        `Missing required fields: ${validation.missing?.join(', ')}`,
        400
      );
    }

    await createTask(phaseId, name, status);

    return successResponse();
  } catch (error) {
    console.error('Error creating task:', error);
    return errorResponse('Failed to create task');
  }
} 