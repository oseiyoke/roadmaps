# Notion Integration Setup Guide

## Prerequisites

1. A Notion workspace with your roadmap data
2. Access to create a Notion integration

## Step 1: Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Give it a name (e.g., "CTM Roadmap")
4. Select your workspace
5. Copy the **Internal Integration Token**

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following:

```bash
# Notion Integration Token
NOTION_API_TOKEN=your_integration_token_here

# Database IDs (we'll get these in step 4)
NOTION_PROJECTS_DATABASE_ID=your_projects_database_id
NOTION_TASKS_DATABASE_ID=your_tasks_database_id
```

## Step 3: Share Your Databases with the Integration

1. Open your Projects database in Notion
2. Click the "..." menu in the top right
3. Select "Add connections"
4. Search for and select your integration name
5. Repeat for the Tasks database

## Step 4: Find Your Database IDs

### Option A: Using the Discover Tool (Recommended)

1. Start your development server: `npm run dev`
2. Open your browser's developer console
3. Run this in the console:

```javascript
fetch('/api/notion/discover', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    pageUrl: 'https://www.notion.so/Projects-Tasks-2092eeabe41d81b38a3eeb734794af5d' 
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

4. Look for databases named "Projects" and "Tasks" in the response
5. Copy their IDs to your `.env.local` file

### Option B: Manual Method

1. Open your database in Notion
2. Click "Share" → "Copy link"
3. The URL will look like: `https://www.notion.so/workspace/1234567890abcdef?v=...`
4. The database ID is the part before the `?`: `1234567890abcdef`

## Step 5: Verify Your Setup

Run your development server and check if the roadmap loads:

```bash
npm run dev
```

Open http://localhost:3000 and you should see:
- "Loading roadmap from Notion..." message
- Then your roadmap with phases and tasks from Notion

## Troubleshooting

### "NOTION_PROJECTS_DATABASE_ID not configured" Error
- Make sure your `.env.local` file has the correct database IDs
- Restart your development server after adding environment variables

### "Failed to fetch phases" Error
- Verify your integration has access to both databases
- Check that your integration token is correct
- Ensure database properties match expected names:
  - Projects: Project name, Status, Dates
  - Tasks: Task name, Status, Project (relation)

### Empty Roadmap
- Check that your Projects database has entries starting with "Phase X:"
- Verify tasks are properly linked to projects via the Project relation

## Expected Notion Structure

### Projects Database
- **Project name**: Text (e.g., "Phase 1: Quick Wins & Foundation")
- **Status**: Select (Planning, In Progress, Done, Not Started, Complete)
- **Dates**: Date range

### Tasks Database
- **Task name**: Text
- **Status**: Select (Done, Not Started, In Progress)
- **Project**: Relation to Projects database
- **Due**: Date (optional)
- **Tags**: Multi-select (optional)

### Phase Page Content
Structure your phase pages with these headers:
- "About this project" - Overview paragraph
- "Pain Points Addressed:" - Bullet list
- "Expected Outcomes:" - Bullet list
- "Requirements" - Bullet list 