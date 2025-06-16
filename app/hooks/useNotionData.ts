'use client';

import { useState, useEffect, useContext } from 'react';
import { PhaseData, ContentBlock } from '@/app/types/roadmap';
import { filterTasksByPhase } from '@/lib/notion';
import { RoadmapConfigContext } from '@/app/components/roadmap/RoadmapViewer';

interface NotionPhase {
  id: string;
  phase: number;
  title: string;
  tagline: string;
  status: string;
  startDate: string;
  endDate: string;
  critical: boolean;
  content?: ContentBlock[]; // content blocks array directly on phase
  about?: string;
  painPoints?: string[];
  outcomes?: string[];
  requirements?: string[];
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
}

interface NotionTask {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  tags: string[];
  projectIds: string[];
}

interface RoadmapData {
  phases: NotionPhase[];
  tasks: NotionTask[];
}

export function useNotionData() {
  const [phases, setPhases] = useState<NotionPhase[]>([]);
  const [phaseData, setPhaseData] = useState<Record<number, PhaseData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get config from context - will be null if not inside RoadmapViewer
  const roadmapConfig = useContext(RoadmapConfigContext);

  // Fetch phases and tasks on mount
  useEffect(() => {
    // Only fetch data if we have a valid config
    if (roadmapConfig?.notionConfig) {
      fetchAllData();
    } else {
      // If no config, set loading to false and clear any error
      setLoading(false);
      setError(null);
    }
  }, [roadmapConfig]);

  const fetchAllData = async () => {
    // Don't fetch if no config is available
    if (!roadmapConfig?.notionConfig) {
      setLoading(false);
      setError('Notion configuration is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare headers with roadmap config
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-roadmap-config': JSON.stringify(roadmapConfig)
      };

      // Fetch both phases (with content) and tasks in one request
      const response = await fetch('/api/notion/phases-with-tasks', {
        headers
      });
      
      if (!response.ok) throw new Error('Failed to fetch roadmap data');
      const data: RoadmapData = await response.json();

      setPhases(data.phases);

      // Build phase data map with filtered tasks and content
      const phaseDataMap: Record<number, PhaseData> = {};
      data.phases.forEach(phase => {
        // Filter tasks for this phase
        const phaseTasks = filterTasksByPhase(data.tasks, phase.id);

        phaseDataMap[phase.phase] = {
          title: phase.title,
          tagline: phase.tagline,
          status: phase.status,
          startDate: formatDate(phase.startDate),
          endDate: formatDate(phase.endDate),
          critical: phase.critical,
          tasks: phaseTasks.map(task => ({
            name: task.name,
            status: task.status as 'completed' | 'in-progress' | 'pending',
            startDate: task.startDate ? formatDate(task.startDate) : undefined,
            endDate: task.endDate ? formatDate(task.endDate) : undefined
          })),
          content: phase.content || [],
          icon: phase.icon
        };
        
      });

      setPhaseData(phaseDataMap);
    } catch (err) {
      console.error('Error fetching Notion data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchAllData();
  };

  return {
    phases,
    phaseData,
    loading,
    error,
    refresh
  };
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
} 