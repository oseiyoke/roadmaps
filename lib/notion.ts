import { notion, NOTION_TO_STATUS, getProjectsDatabaseId, getTasksDatabaseId } from './notion-client';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>();

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Type definitions
interface NotionBlock {
  type: string;
  heading_1?: { rich_text: Array<{ plain_text: string }> };
  heading_2?: { rich_text: Array<{ plain_text: string }> };
  heading_3?: { rich_text: Array<{ plain_text: string }> };
  paragraph?: { rich_text: Array<{ plain_text: string }> };
  bulleted_list_item?: { rich_text: Array<{ plain_text: string }> };
}

interface NotionPage {
  id: string;
  properties: {
    'Project name'?: { title: Array<{ plain_text: string }> };
    Status?: { status?: { name: string } };
    Dates?: { date?: { start: string; end: string } };
    [key: string]: unknown;
  };
}

interface NotionTask {
  id: string;
  properties: {
    'Task name'?: { title: Array<{ plain_text: string }> };
    Status?: { status?: { name: string } };
    Due?: { date?: { start: string } };
    Tags?: { multi_select?: Array<{ name: string }> };
    Project?: { relation?: Array<{ id: string }> };
  };
}

export interface Phase {
  id: string;
  phase: number;
  title: string;
  tagline: string;
  status: string;
  startDate: string;
  endDate: string;
  critical: boolean;
}

export interface Task {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  tags: string[];
  projectIds: string[];
}

export interface PhaseContent {
  about?: string;
  painPoints?: string[];
  outcomes?: string[];
  requirements?: string[];
}

// Helper function to extract text from rich text
function extractPlainText(richText?: Array<{ plain_text: string }>): string {
  return richText?.map(text => text.plain_text).join('') || '';
}

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

// Parse Notion blocks into structured content
export function parsePageContent(blocks: NotionBlock[]): PhaseContent {
  const content: PhaseContent = {};
  let currentSection: keyof PhaseContent | null = null;
  let currentList: string[] = [];
  
  const saveCurrentList = () => {
    if (!currentSection || currentList.length === 0) return;
    
    switch (currentSection) {
      case 'painPoints':
        content.painPoints = [...currentList];
        break;
      case 'outcomes':
        content.outcomes = [...currentList];
        break;
      case 'requirements':
        content.requirements = [...currentList];
        break;
    }
  };
  
  blocks.forEach((block) => {
    // Handle headings
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      // Save previous section if it was a list
      saveCurrentList();
      currentList = [];
      
      const headingText = extractPlainText(block[block.type]?.rich_text);
      const normalizedText = headingText.toLowerCase();
      
      // Map heading to section
      if (normalizedText.includes('about')) {
        currentSection = 'about';
      } else if (normalizedText.includes('pain points')) {
        currentSection = 'painPoints';
      } else if (normalizedText.includes('outcomes')) {
        currentSection = 'outcomes';
      } else if (normalizedText.includes('requirements')) {
        currentSection = 'requirements';
      }
    }
    
    // Handle paragraphs
    if (block.type === 'paragraph' && currentSection && block.paragraph) {
      const text = extractPlainText(block.paragraph.rich_text);
      
      if (text.trim()) {
        if (currentSection === 'about') {
          content.about = (content.about || '') + text + '\n';
        } else {
          currentList.push(text);
        }
      }
    }
    
    // Handle bullet lists
    if (block.type === 'bulleted_list_item' && currentSection && block.bulleted_list_item) {
      const text = extractPlainText(block.bulleted_list_item.rich_text);
      
      if (text.trim()) {
        currentList.push(text);
      }
    }
  });
  
  // Save last section
  saveCurrentList();
  
  return content;
}

// Fetch all phases (projects) from Notion
export async function fetchPhases(): Promise<Phase[]> {
  const cacheKey = 'phases';
  const cached = getCached<Phase[]>(cacheKey);
  if (cached) return cached;
  
  try {
    const databaseId = getProjectsDatabaseId();
    
    // Fetch all pages with pagination
    const allResults = await paginateResults(async (cursor) => 
      notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
        sorts: [
          {
            property: 'Dates',
            timestamp: 'created_time',
            direction: 'ascending',
          },
        ]
      })
    );
    
    const phases = allResults.map((page, index) => {
      const notionPage = page as NotionPage;
      const properties = notionPage.properties;
      
      // Extract phase number from title (e.g., "Phase 1: Quick Wins" -> 1)
      const title = extractPlainText(properties['Project name']?.title);
      const phaseMatch = title.match(/Phase (\d+):/);
      const phaseNumber = phaseMatch ? parseInt(phaseMatch[1]) : index + 1;
      
      // Extract title and tagline
      const tagline = title.split(':')[1]?.trim() || '';

      return {
        id: notionPage.id,
        phase: phaseNumber,
        title: title,
        tagline: tagline,
        status: NOTION_TO_STATUS[properties.Status?.status?.name as keyof typeof NOTION_TO_STATUS] || 'pending',
        startDate: properties.Dates?.date?.start || '',
        endDate: properties.Dates?.date?.end || '',
        critical: title.toLowerCase().includes('critical') || false,
      };
    });
    
    // Sort phases by startDate ascending (fallback to phase number if invalid)
    phases.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return (dateA - dateB) || (a.phase - b.phase);
    });
    
    setCache(cacheKey, phases);
    return phases;
  } catch (error) {
    console.error('Error fetching phases:', error);
    throw error;
  }
}

// Fetch detailed phase content including page blocks
export async function fetchPhaseContent(phaseId: string): Promise<PhaseContent> {
  const cacheKey = `phase-${phaseId}`;
  const cached = getCached<PhaseContent>(cacheKey);
  if (cached) return cached;
  
  try {
    // Get all page blocks with pagination
    const allBlocks = await paginateResults(async (cursor) =>
      notion.blocks.children.list({
        block_id: phaseId,
        start_cursor: cursor,
        page_size: 100,
      })
    );
    
    // Parse the blocks into structured content
    const content = parsePageContent(allBlocks as NotionBlock[]);
    
    setCache(cacheKey, content);
    return content;
  } catch (error) {
    console.error('Error fetching phase content:', error);
    throw error;
  }
}

// Fetch all tasks from the database (optimized approach)
export async function fetchAllTasks(): Promise<Task[]> {
  const cacheKey = 'all-tasks';
  const cached = getCached<Task[]>(cacheKey);
  if (cached) return cached;
  
  try {
    const databaseId = getTasksDatabaseId();
    
    // Fetch all pages with pagination, sorted by Due date ascending
    const allResults = await paginateResults(async (cursor) =>
      notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
        sorts: [
          { property: 'Due', direction: 'ascending' }
        ]
      })
    );
    
    const tasks = allResults.map((task) => {
      const notionTask = task as NotionTask;
      const properties = notionTask.properties;
      
      // Extract project relation IDs
      const projectIds = properties.Project?.relation?.map(rel => rel.id).filter(Boolean) || [];

      return {
        id: notionTask.id,
        name: extractPlainText(properties['Task name']?.title),
        status: NOTION_TO_STATUS[properties.Status?.status?.name as keyof typeof NOTION_TO_STATUS] || 'pending',
        dueDate: properties.Due?.date?.start || '',
        tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
        projectIds,
      };
    });
    
    setCache(cacheKey, tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    throw error;
  }
}

// Refresh cache for specific key or all
export function refreshCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Clear cache related to a specific phase
export function refreshPhaseCache(phaseId: string) {
  cache.delete('phases');
  cache.delete(`phase-${phaseId}`);
  cache.delete('all-tasks'); // Clear all tasks cache since we now fetch all at once
}

// Clear all tasks cache (useful for when tasks are updated)
export function refreshTasksCache() {
  cache.delete('all-tasks');
}

// Helper function to filter tasks by phase ID (for client-side use)
export function filterTasksByPhase(
  allTasks: Task[],
  phaseId: string
) {
  return allTasks
    .filter(task => task.projectIds.includes(phaseId))
    .map(task => ({
      id: task.id,
      name: task.name,
      status: task.status,
      dueDate: task.dueDate,
      tags: task.tags,
    }));
}

// Re-export status map for backward compatibility
export const statusMap = NOTION_TO_STATUS; 