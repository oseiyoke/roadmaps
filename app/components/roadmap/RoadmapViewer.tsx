'use client';

import React, { createContext, useContext } from 'react';
import { Roadmap } from './Roadmap';

interface RoadmapConfig {
  id: string;
  name: string;
  platform: string;
  notionConfig?: {
    accessToken: string;
    projectsDatabaseId: string;
    tasksDatabaseId: string;
  };
}

interface RoadmapViewerProps {
  config: RoadmapConfig;
}

// Create a context to pass config down to components
export const RoadmapConfigContext = createContext<RoadmapConfig | null>(null);

export function useRoadmapConfig() {
  const context = useContext(RoadmapConfigContext);
  if (!context) {
    throw new Error('useRoadmapConfig must be used within RoadmapConfigProvider');
  }
  return context;
}

export default function RoadmapViewer({ config }: RoadmapViewerProps) {
  // Set environment-like variables for the API to use
  if (typeof window !== 'undefined' && config.notionConfig) {
    // Store config temporarily in sessionStorage for API calls
    sessionStorage.setItem('current_roadmap_config', JSON.stringify(config));
  }

  return (
    <RoadmapConfigContext.Provider value={config}>
      <Roadmap />
    </RoadmapConfigContext.Provider>
  );
} 