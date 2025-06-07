import { createNotionClient, getTasksDatabaseId, NotionConfig } from './notion-client';

// Get task by ID directly (more efficient than index-based lookup)
export async function getTaskById(taskId: string, config: NotionConfig) {
  try {
    const notion = createNotionClient(config);
    const page = await notion.pages.retrieve({ page_id: taskId });
    return page;
  } catch (error) {
    console.error('Error retrieving task:', error);
    return null;
  }
}

// Get tasks for a phase using index (for backward compatibility)
export async function getTaskByPhaseAndIndex(phaseId: string, taskIndex: number, config: NotionConfig) {
  const notion = createNotionClient(config);
  const databaseId = getTasksDatabaseId(config);
  
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Project',
      relation: {
        contains: phaseId
      }
    }
  });

  if (taskIndex >= response.results.length) {
    return null;
  }

  return response.results[taskIndex];
} 