import { Client } from '@notionhq/client';

// Singleton Notion client instance
export const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

// Shared status mappings
export const STATUS_TO_NOTION = {
  'pending': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Done',
} as const;

export const NOTION_TO_STATUS = {
  'Planning': 'in-progress',
  'In Progress': 'in-progress',
  'Done': 'completed',
  'Not Started': 'pending',
  'Backlog': 'pending',
  'Complete': 'completed',
} as const;

// Database ID getters with validation
export function getProjectsDatabaseId(): string {
  const id = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!id) {
    throw new Error('NOTION_PROJECTS_DATABASE_ID not configured');
  }
  return id;
}

export function getTasksDatabaseId(): string {
  const id = process.env.NOTION_TASKS_DATABASE_ID;
  if (!id) {
    throw new Error('NOTION_TASKS_DATABASE_ID not configured');
  }
  return id;
}

// Common error response helper
export function createErrorResponse(message: string, status: number = 500) {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
} 