# Roadmap Visualizer

Transform your Notion roadmaps into beautiful, interactive visualizations that keep your team aligned and engaged.

## Features

- 🔗 **Seamless Notion Integration** - Connect directly to your existing Notion databases
- 📊 **Interactive Visualizations** - Beautiful timeline and progress views of your roadmaps
- 🔄 **Real-time Sync** - Automatically sync with your Notion workspace
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎯 **Progress Tracking** - Visual completion status and phase progress
- 🚀 **Easy Setup** - Get started in minutes with our guided onboarding

## Prerequisites

Before you begin, make sure you have:

1. **A Notion workspace** with roadmap data structured as:
   - A database for your **project phases/milestones**
   - A database for your **tasks**
   - Tasks linked to their phases using a Notion relation

2. **Node.js 18+** installed on your machine

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roadmap
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Getting Started

### Step 1: Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Roadmap Visualizer")
4. Select your workspace
5. Copy the **Integration Token** (starts with `ntn_`)

### Step 2: Share Your Databases

1. Open your integration at [Notion Integrations](https://www.notion.so/my-integrations)
2. Click on your integration, then the **Access** tab
3. Grant access to the pages containing your roadmap databases

### Step 3: Connect Your Roadmap

1. Open the Roadmap Visualizer app
2. Click "Get Started"
3. Follow the guided setup:
   - Enter your Integration Token
   - Select your databases (projects/phases and tasks)
   - Preview your roadmap data
   - Start visualizing!

## Database Structure

### Projects/Phases Database

Your projects database should contain:
- **Name/Title** - The phase or milestone name
- **Status** - Current status (e.g., "Not Started", "In Progress", "Completed")
- **Start Date** (optional) - When the phase begins
- **End Date** (optional) - When the phase should complete

### Tasks Database

Your tasks database should contain:
- **Name/Title** - The task name
- **Status** - Current status (e.g., "To Do", "In Progress", "Done")
- **Project/Phase** - A relation to your projects database
- **Assignee** (optional) - Who's responsible for the task

## Supported Status Values

The app automatically maps common Notion status values:

**Completed/Done States:**
- ✅ Done
- ✅ Complete
- ✅ Completed
- ✅ Finished

**In Progress States:**
- 🔄 In Progress
- 🔄 In Review
- 🔄 Working

**Pending States:**
- ⏳ To Do
- ⏳ Not Started
- ⏳ Planned
- ⏳ Backlog

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono
- **Icons**: Heroicons
- **API Integration**: Notion API (@notionhq/client)
- **Visualizations**: D3.js (d3-shape)
- **TypeScript**: Full type safety

## Project Structure

```
roadmap/
├── app/                     # Next.js App Router
│   ├── api/                # API routes
│   │   └── notion/         # Notion integration endpoints
│   │   └── components/     # Reusable components
│   │   └── dashboard/      # Dashboard page
│   │   └── onboarding/     # Setup flow
│   │   └── roadmap/        # Roadmap viewer
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
├── README.md               # This file
└── .gitignore              # Git ignore file
```

## API Endpoints

- `POST /api/notion/discover` - Discover available databases
- `POST /api/notion/test` - Test connection and preview data
- `GET /api/notion/phases` - Fetch all phases
- `GET /api/notion/phases-with-tasks` - Fetch phases with tasks
- `POST /api/notion/phases/update` - Update phase status

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

**"Could not find database" Error**
- Ensure you've shared the databases with your integration
- Check that the database IDs are correct

**"API token is invalid" Error**
- Verify your integration token is correct
- Make sure the integration has access to your workspace

**No databases showing up**
- Confirm databases are shared with your integration
- Refresh the database selector page

**Hydration mismatch warnings**
- These are typically caused by browser extensions and won't affect functionality

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Notion setup follows the prerequisites
3. Ensure all databases are properly shared with your integration

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by the [Notion API](https://developers.notion.com)
- Icons by [Heroicons](https://heroicons.com)
- Fonts by [Vercel](https://vercel.com/font)
