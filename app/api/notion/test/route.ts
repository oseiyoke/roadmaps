import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function GET() {
  try {
    // Check if token is configured
    if (!process.env.NOTION_API_TOKEN) {
      return NextResponse.json({
        error: 'NOTION_API_TOKEN not configured',
        setup: 'Please add NOTION_API_TOKEN to your .env.local file'
      }, { status: 500 });
    }

    const notion = new Client({
      auth: process.env.NOTION_API_TOKEN,
    });

    // Try to search for databases
    const databases = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      },
      page_size: 10
    });

    const dbList = databases.results.map((db) => {
      const database = db as { 
        id: string; 
        title?: Array<{ plain_text: string }>; 
        created_time: string; 
        url: string 
      };
      return {
        id: database.id,
        title: database.title?.[0]?.plain_text || 'Untitled',
        created: database.created_time,
        url: database.url
      };
    });

    // Check which database IDs are configured
    const configured = {
      projects: process.env.NOTION_PROJECTS_DATABASE_ID || 'Not configured',
      tasks: process.env.NOTION_TASKS_DATABASE_ID || 'Not configured'
    };

    return NextResponse.json({
      status: 'Connected to Notion',
      configured_ids: configured,
      available_databases: dbList,
      instructions: {
        step1: 'Find your Projects and Tasks databases in the list below',
        step2: 'Copy their IDs to your .env.local file',
        step3: 'Restart your development server'
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to connect to Notion',
      message: errorMessage,
      possible_causes: [
        'Invalid NOTION_API_TOKEN',
        'Integration not added to workspace',
        'No databases shared with integration'
      ]
    }, { status: 500 });
  }
} 