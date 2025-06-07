import { Client } from '@notionhq/client';
import { errorResponse, successResponse } from '@/lib/api-utils';

// Helper function to paginate through Notion search results
async function paginateSearch(
  notion: Client,
  filter: { property: 'object'; value: 'database' | 'page' }
): Promise<unknown[]> {
  const allResults: unknown[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;
  
  while (hasMore) {
    const response = await notion.search({
      filter,
      start_cursor: startCursor,
      page_size: 100
    });
    
    allResults.push(...response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;
  }
  
  return allResults;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, pageUrl } = body;

    if (!token) {
      return errorResponse('Token is required', 400);
    }

    // Create a Notion client with the provided token
    const notion = new Client({
      auth: token,
    });

    // Search for all databases the integration has access to (with pagination)
    const allDatabases = await paginateSearch(notion, {
      property: 'object',
      value: 'database'
    });

    // Format the results
    interface NotionDatabase {
      id: string;
      title?: Array<{ plain_text: string }>;
      object: string;
      icon?: unknown;
      url?: string;
    }
    
    const databases = allDatabases.map((result) => {
      const database = result as NotionDatabase;
      return {
        id: database.id,
        title: database.title?.[0]?.plain_text || 'Untitled Database',
        object: database.object,
        icon: database.icon,
        url: database.url
      };
    });

    // If a pageUrl was provided, also try to discover databases from that page
    const pageDatabases: Array<{id: string; title: string; object: string; fromPage: boolean}> = [];
    if (pageUrl) {
      try {
        // Extract page ID from URL
        const pageId = extractPageId(pageUrl);
        if (pageId) {
          // Get child blocks of the page
          const blocks = await notion.blocks.children.list({
            block_id: pageId,
            page_size: 100
          });

          // Find database links in the page
          for (const block of blocks.results) {
            if ('type' in block && block.type === 'child_database') {
              pageDatabases.push({
                id: block.id,
                title: 'Child Database',
                object: 'database',
                fromPage: true
              });
            }
          }
        }
      } catch (err) {
        console.error('Error discovering page databases:', err);
        // Continue without page databases
      }
    }

    return successResponse({
      databases: [...databases, ...pageDatabases],
      total: databases.length + pageDatabases.length
    });
  } catch (error) {
    console.error('Error discovering Notion databases:', error);
    return errorResponse('Failed to discover databases. Make sure your integration token is valid.', 500);
  }
}

function extractPageId(url: string): string | null {
  try {
    // Handle various Notion URL formats
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Extract the ID (last part of the path, before any query params)
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Notion IDs are 32 characters (without dashes)
    const idMatch = lastPart.match(/([a-f0-9]{32})/i);
    if (idMatch) {
      return idMatch[1];
    }
    
    // Try with dashes (formatted ID)
    const dashIdMatch = lastPart.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (dashIdMatch) {
      return dashIdMatch[1];
    }
    
    return null;
  } catch {
    return null;
  }
} 