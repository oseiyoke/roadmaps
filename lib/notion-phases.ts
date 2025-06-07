import { createNotionClient, NotionConfig } from './notion-client';
import { refreshPhaseCache } from './notion';

// Update a phase
export async function updatePhase(phaseId: string, updates: { title?: string; status?: string }, config: NotionConfig) {
  const notion = createNotionClient(config);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any = {};

  if (updates.title) {
    properties['Project name'] = {
      title: [{
        text: {
          content: updates.title
        }
      }]
    };
  }

  if (updates.status) {
    properties.Status = {
      select: {
        name: updates.status
      }
    };
  }

  const response = await notion.pages.update({
    page_id: phaseId,
    properties
  });

  refreshPhaseCache(phaseId);
  return response;
} 