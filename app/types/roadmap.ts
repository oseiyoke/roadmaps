export interface Task {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface PhaseData {
  title: string;
  tagline: string;
  startDate: string;
  endDate: string;
  critical: boolean;
  tasks: Task[];
  about?: string;
  painPoints: string[];
  outcomes: string[];
  requirements: string[];
  dependencies?: string[];
}

export interface Milestone {
  id: number;
  x: number;
  y: number;
  phase: number;
  status: 'completed' | 'in-progress' | 'pending';
  critical?: boolean;
}

export interface TaskDot {
  x: number;
  y: number;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface RoadmapData {
  phases: Record<number, PhaseData>;
  milestones: Milestone[];
  taskDots: TaskDot[];
  currentPosition: { x: number; y: number };
} 