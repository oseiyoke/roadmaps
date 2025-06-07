import { fetchPhases } from '@/lib/notion';
import { errorResponse, successResponse, getRoadmapConfig } from '@/lib/api-utils';

// Force dynamic rendering since we use request headers
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get config from headers - now required
    const config = getRoadmapConfig(request);
    
    if (!config?.notionConfig) {
      return errorResponse('Notion configuration is required', 400);
    }

    const phases = await fetchPhases(config.notionConfig);
    return successResponse(phases);
  } catch (error) {
    console.error('Error fetching phases:', error);
    return errorResponse('Failed to fetch phases');
  }
} 