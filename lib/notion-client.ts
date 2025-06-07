import { Client } from '@notionhq/client';

// Define the status mapping
export const NOTION_TO_STATUS = {
  'Done': 'completed',
  'Complete': 'completed',
  'In Progress': 'in-progress',
  'Not Started': 'pending',
  'Planning': 'pending'
} as const;

// Create the Notion client - will use environment variables
export const notion = new Client({
  auth: process.env.NOTION_API_TOKEN!,
});

// Export functions to get database IDs
export function getProjectsDatabaseId() {
  const id = process.env.NOTION_PROJECTS_DATABASE_ID;
  
  if (!id) {
    throw new Error('NOTION_PROJECTS_DATABASE_ID not configured');
  }
  
  return id;
}

export function getTasksDatabaseId() {
  const id = process.env.NOTION_TASKS_DATABASE_ID;
  
  if (!id) {
    throw new Error('NOTION_TASKS_DATABASE_ID not configured');
  }
  
  return id;
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