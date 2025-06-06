import { notion, STATUS_TO_NOTION, getTasksDatabaseId } from './notion-client';
import { refreshTasksCache } from './notion';

// Get task by ID directly (more efficient than index-based lookup)
export async function getTaskById(taskId: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: taskId });
    return page;
  } catch (error) {
    console.error('Error retrieving task:', error);
    return null;
  }
}

// Create a new task
export async function createTask(phaseId: string, name: string, status: string = 'pending') {
  const databaseId = getTasksDatabaseId();
  
  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      'Task name': {
        title: [{
          text: {
            content: name
          }
        }]
      },
      'Status': {
        select: {
          name: STATUS_TO_NOTION[status as keyof typeof STATUS_TO_NOTION] || 'Not Started'
        }
      },
      'Project': {
        relation: [{
          id: phaseId
        }]
      }
    }
  });

  refreshTasksCache();
  return response;
}

// Update a task
export async function updateTask(taskId: string, updates: { name?: string; status?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {};

  if (updates.status) {
    properties.Status = {
      select: {
        name: STATUS_TO_NOTION[updates.status as keyof typeof STATUS_TO_NOTION] || 'Not Started'
      }
    };
  }

  if (updates.name) {
    properties['Task name'] = {
      title: [{
        text: {
          content: updates.name
        }
      }]
    };
  }

  const response = await notion.pages.update({
    page_id: taskId,
    properties
  });

  refreshTasksCache();
  return response;
}

// Delete (archive) a task
export async function deleteTask(taskId: string) {
  const response = await notion.pages.update({
    page_id: taskId,
    archived: true
  });

  refreshTasksCache();
  return response;
}

// Get tasks for a phase using index (for backward compatibility)
export async function getTaskByPhaseAndIndex(phaseId: string, taskIndex: number) {
  const databaseId = getTasksDatabaseId();
  
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