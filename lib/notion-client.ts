import { Client } from '@notionhq/client';

// Define the status mapping
export const NOTION_TO_STATUS = {
  'Done': 'completed',
  'Complete': 'completed',
  'In Progress': 'in-progress',
  'Not Started': 'pending',
  'Planning': 'pending'
} as const;

// Config interface for Notion
export interface NotionConfig {
  accessToken: string;
  projectsDatabaseId: string;
  tasksDatabaseId: string;
}

// Create the Notion client with provided config
export function createNotionClient(config: NotionConfig) {
  return new Client({
    auth: config.accessToken,
  });
}

// Export functions to get database IDs from config
export function getProjectsDatabaseId(config: NotionConfig) {
  if (!config.projectsDatabaseId) {
    throw new Error('Projects database ID not configured');
  }
  
  return config.projectsDatabaseId;
}

export function getTasksDatabaseId(config: NotionConfig) {
  if (!config.tasksDatabaseId) {
    throw new Error('Tasks database ID not configured');
  }
  
  return config.tasksDatabaseId;
}

// Shared status mappings
export const STATUS_TO_NOTION = {
  'pending': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Done',
} as const;

// Common error response helper
export function notionErrorResponse(error: unknown) {
  console.error('Notion API Error:', error);
  
  if (error instanceof Error) {
    return {
      error: 'Notion API Error',
      message: error.message,
      details: error,
    };
  }
  
  return {
    error: 'Unknown Notion API Error',
    message: 'An unexpected error occurred',
  };
} 