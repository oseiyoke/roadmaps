import { NextRequest } from 'next/server';
import { updatePhase } from '@/lib/notion-phases';
import { errorResponse, successResponse, validateRequired, getRoadmapConfig } from '@/lib/api-utils';

// Force dynamic rendering since we use request headers
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    // Get config from headers - now required
    const config = getRoadmapConfig(request);
    
    if (!config?.notionConfig) {
      return errorResponse('Notion configuration is required', 400);
    }

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
    await updatePhase(phaseId, { title }, config.notionConfig);

    return successResponse({ success: true });
  } catch (error) {
    console.error('Error updating phase:', error);
    return errorResponse('Failed to update phase');
  }
} 