import { NOTION_TO_STATUS, createNotionClient, getProjectsDatabaseId, getTasksDatabaseId, NotionConfig } from './notion-client';
import { ContentBlock } from '@/app/types/roadmap';

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

// Generate roadmap-specific cache key
function createCacheKey(config: NotionConfig, suffix: string): string {
  // Use database IDs as unique identifiers for the roadmap
  const projectsDbId = getProjectsDatabaseId(config);
  const tasksDbId = getTasksDatabaseId(config);
  return `${projectsDbId}-${tasksDbId}-${suffix}`;
}

// Type definitions
interface NotionBlock {
  type: string;
  heading_1?: { rich_text: Array<{ plain_text: string }> };
  heading_2?: { rich_text: Array<{ plain_text: string }> };
  heading_3?: { rich_text: Array<{ plain_text: string }> };
  paragraph?: { rich_text: Array<{ plain_text: string }> };
  bulleted_list_item?: { rich_text: Array<{ plain_text: string }> };
  numbered_list_item?: { rich_text: Array<{ plain_text: string }> };
  quote?: { rich_text: Array<{ plain_text: string }> };
  callout?: { 
    rich_text: Array<{ plain_text: string }>;
    icon?: { emoji?: string };
    color?: string;
  };
  code?: { 
    rich_text: Array<{ plain_text: string }>;
    language?: string;
  };
  divider?: object;
  toggle?: { rich_text: Array<{ plain_text: string }> };
}

interface NotionPage {
  id: string;
  properties: {
    'Project name'?: { title: Array<{ plain_text: string }> };
    Status?: { status?: { name: string } };
    Dates?: { date?: { start: string; end: string } };
    [key: string]: unknown;
  };
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  } | null;
}

interface NotionTask {
  id: string;
  properties: {
    'Task name'?: { title: Array<{ plain_text: string }> };
    Status?: { status?: { name: string } };
    Due?: { date?: { start: string; end?: string } };
    'Start Date'?: { date?: { start: string } };
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
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
}

export interface Task {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  tags: string[];
  projectIds: string[];
}

export interface PhaseContent {
  content: ContentBlock[];
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

// Parse Notion blocks into flexible content structure
export function parsePageContent(blocks: NotionBlock[]): PhaseContent {
  const contentBlocks: ContentBlock[] = [];
  
  blocks.forEach((block, index) => {
    const blockId = `block-${index}`;
    // Create content block based on type
    let contentBlock: ContentBlock | null = null;
    
    // Handle headings
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      const headingText = extractPlainText(block[block.type]?.rich_text);
      
      contentBlock = {
        id: blockId,
        type: block.type as 'heading_1' | 'heading_2' | 'heading_3',
        text: headingText,
      };
    }
    
    // Handle paragraphs
    if (block.type === 'paragraph' && block.paragraph) {
      const text = extractPlainText(block.paragraph.rich_text);
      
      if (text.trim()) {
        contentBlock = {
          id: blockId,
          type: 'paragraph',
          text: text,
        };
      }
    }
    
    // Handle bullet lists
    if (block.type === 'bulleted_list_item' && block.bulleted_list_item) {
      const text = extractPlainText(block.bulleted_list_item.rich_text);
      
      if (text.trim()) {
        contentBlock = {
          id: blockId,
          type: 'bulleted_list_item',
          text: text,
        };
      }
    }
    
    // Handle numbered lists
    if (block.type === 'numbered_list_item' && block.numbered_list_item) {
      const text = extractPlainText(block.numbered_list_item.rich_text);
      
      if (text.trim()) {
        contentBlock = {
          id: blockId,
          type: 'numbered_list_item',
          text: text,
        };
      }
    }
    
    // Handle quotes
    if (block.type === 'quote' && block.quote) {
      const text = extractPlainText(block.quote.rich_text);
      
      if (text.trim()) {
        contentBlock = {
          id: blockId,
          type: 'quote',
          text: text,
        };
      }
    }
    
    // Handle callouts
    if (block.type === 'callout' && block.callout) {
      const text = extractPlainText(block.callout.rich_text);
      
      if (text.trim()) {
        contentBlock = {
          id: blockId,
          type: 'callout',
          text: text,
          metadata: {
            icon: block.callout.icon?.emoji,
            color: block.callout.color,
          },
        };
      }
    }
    
    // Handle code blocks
    if (block.type === 'code' && block.code) {
      const text = extractPlainText(block.code.rich_text);
      
      if (text.trim()) {
        contentBlock = {
          id: blockId,
          type: 'code',
          text: text,
          metadata: {
            language: block.code.language,
          },
        };
      }
    }
    
    // Handle dividers
    if (block.type === 'divider') {
      contentBlock = {
        id: blockId,
        type: 'divider',
        text: '',
      };
    }
    
    // Handle toggles
    if (block.type === 'toggle' && block.toggle) {
      const text = extractPlainText(block.toggle.rich_text);
      
      if (text.trim()) {
        contentBlock = {
          id: blockId,
          type: 'toggle',
          text: text,
          // TODO: Fetch nested blocks for toggle content
        };
      }
    }
    
    if (contentBlock) {
      contentBlocks.push(contentBlock);
    }
  });
  
  
  return {
    content: contentBlocks
  };
}

// Fetch all phases (projects) from Notion
export async function fetchPhases(config: NotionConfig): Promise<Phase[]> {
  const cacheKey = createCacheKey(config, 'phases');
  const cached = getCached<Phase[]>(cacheKey);
  if (cached) return cached;
  
  try {
    const notion = createNotionClient(config);
    const databaseId = getProjectsDatabaseId(config);
    
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

      // Extract icon data
      let icon = undefined;
      if (notionPage.icon) {
        icon = {
          type: notionPage.icon.type,
          ...(notionPage.icon.emoji && { emoji: notionPage.icon.emoji }),
          ...(notionPage.icon.external && { external: notionPage.icon.external }),
          ...(notionPage.icon.file && { file: notionPage.icon.file }),
        };
      }

      return {
        id: notionPage.id,
        phase: phaseNumber,
        title: title,
        tagline: tagline,
        status: NOTION_TO_STATUS[properties.Status?.status?.name as keyof typeof NOTION_TO_STATUS] || 'pending',
        startDate: properties.Dates?.date?.start || '',
        endDate: properties.Dates?.date?.end || '',
        critical: title.toLowerCase().includes('critical') || false,
        icon,
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
export async function fetchPhaseContent(phaseId: string, config: NotionConfig): Promise<PhaseContent> {
  const cacheKey = createCacheKey(config, `phase-${phaseId}`);
  const cached = getCached<PhaseContent>(cacheKey);
  if (cached) return cached;
  
  try {
    const notion = createNotionClient(config);
    
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
export async function fetchAllTasks(config: NotionConfig): Promise<Task[]> {
  const cacheKey = createCacheKey(config, 'all-tasks');
  const cached = getCached<Task[]>(cacheKey);
  if (cached) return cached;
  
  try {
    const notion = createNotionClient(config);
    const databaseId = getTasksDatabaseId(config);
    
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

      // Get start and end dates - prioritize dedicated Start Date field, fallback to Due date
      const startDate = properties['Start Date']?.date?.start || properties.Due?.date?.start || '';
      const endDate = properties.Due?.date?.end || properties.Due?.date?.start || '';

      return {
        id: notionTask.id,
        name: extractPlainText(properties['Task name']?.title),
        status: NOTION_TO_STATUS[properties.Status?.status?.name as keyof typeof NOTION_TO_STATUS] || 'pending',
        startDate,
        endDate,
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

// Clear all cache for a specific roadmap
export function refreshRoadmapCache(config: NotionConfig) {
  const projectsDbId = getProjectsDatabaseId(config);
  const tasksDbId = getTasksDatabaseId(config);
  const keyPrefix = `${projectsDbId}-${tasksDbId}`;
  
  // Delete all cache entries that start with this roadmap's prefix
  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) {
      cache.delete(key);
    }
  }
}

// Clear cache related to a specific phase
export function refreshPhaseCache(phaseId: string, config: NotionConfig) {
  cache.delete(createCacheKey(config, 'phases'));
  cache.delete(createCacheKey(config, `phase-${phaseId}`));
  cache.delete(createCacheKey(config, 'all-tasks')); // Clear all tasks cache since we now fetch all at once
}

// Clear all tasks cache (useful for when tasks are updated)
export function refreshTasksCache(config: NotionConfig) {
  cache.delete(createCacheKey(config, 'all-tasks'));
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
      startDate: task.startDate,
      endDate: task.endDate,
      tags: task.tags,
    }));
}

// Re-export status map for backward compatibility
export const statusMap = NOTION_TO_STATUS; 