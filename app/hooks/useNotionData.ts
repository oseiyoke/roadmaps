'use client';

import { useState, useEffect } from 'react';
import { PhaseData } from '@/app/types/roadmap';

interface NotionPhase {
  id: string;
  phase: number;
  title: string;
  tagline: string;
  status: string;
  startDate: string;
  endDate: string;
  critical: boolean;
}

interface NotionTask {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  tags: string[];
}

interface NotionContent {
  about?: string;
  painPoints?: string[];
  outcomes?: string[];
  requirements?: string[];
}

export function useNotionData() {
  const [phases, setPhases] = useState<NotionPhase[]>([]);
  const [phaseData, setPhaseData] = useState<Record<number, PhaseData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch phases on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all phases
      const phasesResponse = await fetch('/api/notion/phases');
      if (!phasesResponse.ok) throw new Error('Failed to fetch phases');
      const phasesData: NotionPhase[] = await phasesResponse.json();
      console.log("phasesData", phasesData);
      setPhases(phasesData);

      // Fetch detailed data for each phase
      const phaseDataMap: Record<number, PhaseData> = {};
      
      for (const phase of phasesData) {
        // Fetch phase content
        const contentResponse = await fetch(`/api/notion/phase/${phase.id}`);
        const content: NotionContent = contentResponse.ok 
          ? await contentResponse.json() 
          : {};

        // Fetch phase tasks
        const tasksResponse = await fetch(`/api/notion/tasks/${phase.id}`);
        const tasks: NotionTask[] = tasksResponse.ok 
          ? await tasksResponse.json() 
          : [];

        // Map to PhaseData format
        phaseDataMap[phase.phase] = {
          title: phase.title,
          tagline: phase.tagline,
          startDate: formatDate(phase.startDate),
          endDate: formatDate(phase.endDate),
          critical: phase.critical,
          tasks: tasks.map(task => ({
            name: task.name,
            status: task.status as 'completed' | 'in-progress' | 'pending'
          })),
          about: content.about,
          painPoints: content.painPoints || [],
          outcomes: content.outcomes || [],
          requirements: content.requirements || [],
          dependencies: [] // Add if you have this in Notion
        };
      }

      console.log("phaseDataMap", phaseDataMap);
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