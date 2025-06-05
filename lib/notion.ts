import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

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

// Status mapping
export const statusMap = {
  'Planning': 'in-progress',
  'In Progress': 'in-progress',
  'Done': 'completed',
  'Not Started': 'pending',
  'Complete': 'completed',
} as const;

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
    Status?: { select?: { name: string } };
    Dates?: { date?: { start: string; end: string } };
    [key: string]: unknown;
  };
}

interface NotionTask {
  id: string;
  properties: {
    'Task name'?: { title: Array<{ plain_text: string }> };
    Status?: { select?: { name: string } };
    Due?: { date?: { start: string } };
    Tags?: { multi_select?: Array<{ name: string }> };
    Project?: unknown;
  };
}

interface NotionDatabase {
  id: string;
  title?: Array<{ plain_text: string }>;
  url: string;
}

// Discover database IDs from a shared page URL
export async function discoverDatabaseIds(pageUrl: string) {
  try {
    // Extract page ID from URL
    const pageId = pageUrl.split('-').pop()?.split('?')[0] || '';
    
    // Get the page (just to verify it exists)
    await notion.pages.retrieve({ page_id: pageId });
    
    // Search for databases in the workspace that might be related
    const databases = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    });
    
    return {
      pageId,
      databases: databases.results.map((db) => {
        const database = db as NotionDatabase;
        return {
          id: database.id,
          title: database.title?.[0]?.plain_text || 'Untitled',
          url: database.url
        };
      })
    };
  } catch (error) {
    console.error('Error discovering databases:', error);
    throw error;
  }
}

// Parse Notion blocks into structured content
export function parsePageContent(blocks: NotionBlock[]) {
  const content: {
    about?: string;
    painPoints?: string[];
    outcomes?: string[];
    requirements?: string[];
    [key: string]: string | string[] | undefined;
  } = {};
  
  let currentSection: string | null = null;
  let currentList: string[] = [];
  
  blocks.forEach((block) => {
    // Handle headings
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      // Save previous section if it was a list
      if (currentSection && currentList.length > 0) {
        content[currentSection] = currentList;
        currentList = [];
      }
      
      const headingText = block[block.type]?.rich_text
        ?.map((text: { plain_text: string }) => text.plain_text)
        .join('') || '';
        
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
      const text = block.paragraph.rich_text
        .map((text: { plain_text: string }) => text.plain_text)
        .join('');
      
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
      const text = block.bulleted_list_item.rich_text
        .map((text: { plain_text: string }) => text.plain_text)
        .join('');
      
      if (text.trim()) {
        currentList.push(text);
      }
    }
  });
  
  // Save last section
  if (currentSection && currentList.length > 0) {
    content[currentSection] = currentList;
  }
  
  return content;
}

// Fetch all phases (projects) from Notion
export async function fetchPhases() {
  const cacheKey = 'phases';
  const cached = getCached<Array<{
    id: string;
    phase: number;
    title: string;
    tagline: string;
    status: string;
    startDate: string;
    endDate: string;
    critical: boolean;
  }>>(cacheKey);
  if (cached) return cached;
  
  try {
    const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID;
    if (!databaseId) {
      throw new Error('NOTION_PROJECTS_DATABASE_ID not configured');
    }
    
    const response = await notion.databases.query({
      database_id: databaseId
    });
    console.log("response", response);
    
    const phases = await Promise.all(
      response.results.map(async (page, index) => {
        const notionPage = page as NotionPage;
        const properties = notionPage.properties;
        // Extract phase number from title (e.g., "Phase 1: Quick Wins" -> 1)
        const title = properties['Project name']?.['title']?.[0]?.plain_text || '';
        const phaseMatch = title.match(/Phase (\d+):/);
        const phaseNumber = phaseMatch ? parseInt(phaseMatch[1]) : index + 1;
        
        // Extract title and tagline
        const tagline = title.split(':')[1]?.trim() || '';
        
        return {
          id: notionPage.id,
          phase: phaseNumber,
          title: title,
          tagline: tagline,
          status: statusMap[properties.Status?.select?.name as keyof typeof statusMap || 'Not Started'] || 'pending',
          startDate: properties.Dates?.date?.start || '',
          endDate: properties.Dates?.date?.end || '',
          critical: title.toLowerCase().includes('critical') || false,
        };
      })
    );
    
    // Sort phases by phase number
    phases.sort((a, b) => a.phase - b.phase);
    
    setCache(cacheKey, phases);
    console.log("*****************");
    console.log("phases", phases);
    return phases;
  } catch (error) {
    console.error('Error fetching phases:', error);
    throw error;
  }
}

// Fetch detailed phase content including page blocks
export async function fetchPhaseContent(phaseId: string) {
  const cacheKey = `phase-${phaseId}`;
  const cached = getCached<{
    about?: string;
    painPoints?: string[];
    outcomes?: string[];
    requirements?: string[];
  }>(cacheKey);
  if (cached) return cached;
  
  try {
    // Get the page blocks
    const blocks = await notion.blocks.children.list({
      block_id: phaseId,
      page_size: 100,
    });
    
    // Parse the blocks into structured content
    const content = parsePageContent(blocks.results as NotionBlock[]);
    
    setCache(cacheKey, content);
    return content;
  } catch (error) {
    console.error('Error fetching phase content:', error);
    throw error;
  }
}

// Fetch tasks for a specific phase
export async function fetchPhaseTasks(phaseId: string) {
  const cacheKey = `tasks-${phaseId}`;
  const cached = getCached<Array<{
    id: string;
    name: string;
    status: string;
    dueDate: string;
    tags: string[];
  }>>(cacheKey);
  if (cached) return cached;
  
  try {
    const databaseId = process.env.NOTION_TASKS_DATABASE_ID;
    if (!databaseId) {
      throw new Error('NOTION_TASKS_DATABASE_ID not configured');
    }
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Project',
        relation: {
          contains: phaseId
        }
      }
    });
    
    const tasks = response.results.map((task) => {
      const notionTask = task as NotionTask;
      const properties = notionTask.properties;
      
      return {
        id: notionTask.id,
        name: properties['Task name']?.title?.[0]?.plain_text || '',
        status: statusMap[properties.Status?.select?.name as keyof typeof statusMap || 'Not Started'] || 'pending',
        dueDate: properties.Due?.date?.start || '',
        tags: properties.Tags?.multi_select?.map((tag) => tag.name) || [],
      };
    });
    
    setCache(cacheKey, tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
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