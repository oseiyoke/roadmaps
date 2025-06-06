import { fetchPhases, fetchAllTasks, fetchPhaseContent } from '@/lib/notion';
import { errorResponse, successResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    // Fetch phases and tasks in parallel
    const [phases, allTasks] = await Promise.all([
      fetchPhases(),
      fetchAllTasks()
    ]);

    // Fetch content for each phase in parallel
    const phaseContents = await Promise.all(
      phases.map(phase => fetchPhaseContent(phase.id))
    );

    // Attach content to each phase
    const phasesWithContent = phases.map((phase, idx) => ({
      ...phase,
      content: phaseContents[idx]
    }));

    return successResponse({
      phases: phasesWithContent,
      tasks: allTasks
    });
  } catch (error) {
    console.error('Error fetching phases with tasks:', error);
    return errorResponse('Failed to fetch phases and tasks');
  }
}

// Cache for 5 minutes at the edge
export const revalidate = 300; 