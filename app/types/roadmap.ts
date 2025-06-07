export interface Task {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
}

// Flexible content block structure that mirrors Notion blocks
export interface ContentBlock {
  id: string;
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'paragraph' | 'bulleted_list_item' | 'numbered_list_item' | 'toggle' | 'quote' | 'callout' | 'divider' | 'code';
  text: string;
  children?: ContentBlock[];
  metadata?: {
    language?: string; // for code blocks
    icon?: string; // for callouts
    color?: string; // for callouts
  };
}

export interface PhaseData {
  title: string;
  tagline: string;
  status: string;
  startDate: string;
  endDate: string;
  critical: boolean;
  tasks: Task[];
  content: ContentBlock[];
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
}

export interface Milestone {
  id: number;
  x: number;
  y: number;
  phase: number;
  status: 'completed' | 'in-progress' | 'pending';
  critical?: boolean;
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
}

export interface TaskDot {
  x: number;
  y: number;
  status: 'completed' | 'in-progress' | 'pending';
  name?: string;
  phaseTitle?: string;
}

export interface RoadmapData {
  phases: Record<number, PhaseData>;
  milestones: Milestone[];
  taskDots: TaskDot[];
  currentPosition: { x: number; y: number };
} 