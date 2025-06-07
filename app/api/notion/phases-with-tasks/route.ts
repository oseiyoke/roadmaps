import { fetchPhases, fetchAllTasks, fetchPhaseContent } from '@/lib/notion';
import { errorResponse, successResponse, getRoadmapConfig } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    // Get config from headers if available
    const config = getRoadmapConfig(request);
    
    // If config is provided, temporarily override environment variables
    const originalToken = process.env.NOTION_API_TOKEN;
    const originalProjectsDb = process.env.NOTION_PROJECTS_DATABASE_ID;
    const originalTasksDb = process.env.NOTION_TASKS_DATABASE_ID;
    
    if (config?.notionConfig) {
      process.env.NOTION_API_TOKEN = config.notionConfig.accessToken;
      process.env.NOTION_PROJECTS_DATABASE_ID = config.notionConfig.projectsDatabaseId;
      process.env.NOTION_TASKS_DATABASE_ID = config.notionConfig.tasksDatabaseId;
    }

    try {
      // Fetch phases first
      const phases = await fetchPhases();
      
      // Fetch all tasks once
      const allTasks = await fetchAllTasks();
      
      // Fetch phase content for all phases in parallel
      const phaseContents = await Promise.all(
        phases.map(phase => 
          fetchPhaseContent(phase.id)
            .then(content => ({ phaseId: phase.id, content }))
            .catch(error => {
              console.error(`Error fetching content for phase ${phase.id}:`, error);
              return { phaseId: phase.id, content: {} };
            })
        )
      );
      
      // Create a map for easy lookup
      const contentMap = Object.fromEntries(
        phaseContents.map(({ phaseId, content }) => [phaseId, content])
      );
      
      // Merge content into phases
      const phasesWithContent = phases.map(phase => ({
        ...phase,
        content: contentMap[phase.id] || {}
      }));
      
      return successResponse({
        phases: phasesWithContent,
        tasks: allTasks
      });
    } finally {
      // Restore original environment variables
      if (config?.notionConfig) {
        if (originalToken !== undefined) process.env.NOTION_API_TOKEN = originalToken;
        if (originalProjectsDb !== undefined) process.env.NOTION_PROJECTS_DATABASE_ID = originalProjectsDb;
        if (originalTasksDb !== undefined) process.env.NOTION_TASKS_DATABASE_ID = originalTasksDb;
      }
    }
  } catch (error) {
    console.error('Error fetching phases with tasks:', error);
    return errorResponse('Failed to fetch roadmap data');
  }
}

// Cache for 5 minutes at the edge
export const revalidate = 300; 