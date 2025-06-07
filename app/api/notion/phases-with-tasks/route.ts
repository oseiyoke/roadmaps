import { fetchPhases, fetchAllTasks, fetchPhaseContent } from '@/lib/notion';
import { errorResponse, successResponse, getRoadmapConfig } from '@/lib/api-utils';

// Force dynamic rendering since we use request headers
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get config from headers - now required instead of optional
    const config = getRoadmapConfig(request);
    
    if (!config?.notionConfig) {
      return errorResponse('Notion configuration is required', 400);
    }

    // Fetch phases first
    const phases = await fetchPhases(config.notionConfig);
    
    // Fetch all tasks once
    const allTasks = await fetchAllTasks(config.notionConfig);
    
    // Fetch phase content for all phases in parallel
    const phaseContents = await Promise.all(
      phases.map(phase => 
        fetchPhaseContent(phase.id, config.notionConfig)
          .then(content => {
            return { phaseId: phase.id, content };
          })
          .catch(error => {
            console.error(`Error fetching content for phase ${phase.id}:`, error);
            return { phaseId: phase.id, content: null };
          })
      )
    );
    
    // Create a map for easy lookup
    const contentMap = Object.fromEntries(
      phaseContents
        .filter(({ content }) => content !== null)
        .map(({ phaseId, content }) => [phaseId, content])
    );
    
    // Merge content into phases
    const phasesWithContent = phases.map(phase => {
      const phaseContent = contentMap[phase.id];
      return {
        ...phase,
        content: phaseContent?.content || []
      };
    });
    
    return successResponse({
      phases: phasesWithContent,
      tasks: allTasks
    });
  } catch (error) {
    console.error('Error fetching phases with tasks:', error);
    return errorResponse('Failed to fetch roadmap data');
  }
}

// Cache for 5 minutes at the edge
export const revalidate = 300; 