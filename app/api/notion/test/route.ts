import { Client } from '@notionhq/client';
import { errorResponse, successResponse } from '@/lib/api-utils';
import { NOTION_TO_STATUS } from '@/lib/notion-client';

// Helper function to paginate through Notion results
async function paginateResults<T>(
  queryFn: (cursor?: string) => Promise<{ results: T[]; has_more: boolean; next_cursor: string | null }>
): Promise<T[]> {
  const allResults: T[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;
  
  while (hasMore) {
    const response = await queryFn(startCursor);
    allResults.push(...response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;
  }
  
  return allResults;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, projectsDatabaseId, tasksDatabaseId } = body;

    if (!token || !projectsDatabaseId || !tasksDatabaseId) {
      return errorResponse('Missing required fields: token, projectsDatabaseId, tasksDatabaseId', 400);
    }

    // Create a Notion client with the provided token
    const notion = new Client({
      auth: token,
    });

    // Fetch all projects/phases with pagination
    const allProjects = await paginateResults(async (cursor) =>
      notion.databases.query({
        database_id: projectsDatabaseId,
        start_cursor: cursor,
        page_size: 100
      })
    );

    // Fetch all tasks with pagination
    const allTasks = await paginateResults(async (cursor) =>
      notion.databases.query({
        database_id: tasksDatabaseId,
        start_cursor: cursor,
        page_size: 100
      })
    );

    // Count phases
    const phases = allProjects.length;

    // Count tasks and completed tasks
    interface NotionTask {
      properties?: {
        Status?: {
          status?: {
            name?: string;
          };
        };
      };
    }
    
    const tasks = allTasks.length;
    const completedTasks = allTasks.filter((task) => {
      const notionTask = task as NotionTask;
      const status = notionTask.properties?.Status?.status?.name;
      return status && (NOTION_TO_STATUS[status as keyof typeof NOTION_TO_STATUS] === 'completed');
    }).length;

    // Add a note if we have a lot of data
    const hasLargeDataset = phases > 50 || tasks > 100;

    return successResponse({
      success: true,
      phases,
      tasks,
      completedTasks,
      hasLargeDataset,
      message: hasLargeDataset 
        ? `Successfully connected! Found ${phases} phases and ${tasks} tasks across multiple pages.`
        : 'Successfully connected to your Notion databases!'
    });
  } catch (error) {
    console.error('Error testing Notion connection:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('Could not find database')) {
        return errorResponse('One or more databases not found. Make sure you\'ve shared them with your integration.', 404);
      }
      if (error.message.includes('API token is invalid')) {
        return errorResponse('Invalid integration token. Please check your token and try again.', 401);
      }
    }
    
    return errorResponse('Failed to connect to Notion. Please check your configuration.', 500);
  }
} 