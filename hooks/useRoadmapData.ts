import { useState, useEffect, useMemo } from 'react';
import { filterTasksByPhase } from '@/lib/notion';

interface Phase {
  id: string;
  phase: number;
  title: string;
  tagline: string;
  status: string;
  startDate: string;
  endDate: string;
  critical: boolean;
}

interface Task {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  tags: string[];
  projectIds: string[];
}

interface SimpleTask {
  id: string;
  name: string;
  status: string;
  dueDate: string;
  tags: string[];
}

interface RoadmapData {
  phases: Phase[];
  tasks: Task[];
}

export function useRoadmapData() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/notion/phases-with-tasks');
        
        if (!response.ok) {
          throw new Error('Failed to fetch roadmap data');
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Memoized function to get tasks for a specific phase
  const getTasksForPhase = useMemo(() => {
    if (!data) return () => [];
    
    return (phaseId: string): SimpleTask[] => {
      return filterTasksByPhase(data.tasks, phaseId);
    };
  }, [data]);

  // Memoized function to get phases with their tasks
  const getPhasesWithTasks = useMemo(() => {
    if (!data) return [];
    
    return data.phases.map(phase => ({
      ...phase,
      tasks: filterTasksByPhase(data.tasks, phase.id)
    }));
  }, [data]);

  return {
    phases: data?.phases || [],
    tasks: data?.tasks || [],
    loading,
    error,
    getTasksForPhase,
    getPhasesWithTasks,
    refetch: () => {
      setData(null);
      setLoading(true);
      // Trigger useEffect to refetch
      window.location.reload();
    }
  };
} 