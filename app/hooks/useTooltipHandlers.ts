'use client';

import { useState } from 'react';
import { TaskDot, PhaseData } from '@/app/types/roadmap';

interface TooltipData {
  show: boolean;
  title: string;
  tagline: string;
  position: { x: number; y: number };
}

interface TooltipHandlers {
  tooltipData: TooltipData;
  animationsPaused: boolean;
  handleMilestoneHover: (e: React.MouseEvent, phase: number, phaseData: Record<number, PhaseData>) => void;
  handleTaskHover: (e: React.MouseEvent, task: TaskDot, index: number) => void;
  handleTooltipLeave: () => void;
}

export const useTooltipHandlers = (): TooltipHandlers => {
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    show: false,
    title: '',
    tagline: '',
    position: { x: 0, y: 0 }
  });
  const [animationsPaused, setAnimationsPaused] = useState(false);

  const handleMilestoneHover = (e: React.MouseEvent, phase: number, phaseData: Record<number, PhaseData>) => {
    const data = phaseData[phase];
    if (data) {
      const rect = (e.target as Element).getBoundingClientRect();
      const taskProgress = `${data.tasks.filter(t => t.status === 'completed').length}/${data.tasks.length} tasks completed`;
      const statusText = data.status === 'completed' ? 'Completed' : 
                        data.status === 'in-progress' ? 'In Progress' : 'Pending';
      
      setTooltipData({
        show: true,
        title: `Phase ${phase}: ${data.title}`,
        tagline: `${data.tagline} • ${statusText} • ${taskProgress}`,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.bottom + 10
        }
      });
      setAnimationsPaused(true);
    }
  };

  const handleTaskHover = (e: React.MouseEvent, task: TaskDot, index: number) => {
    const rect = (e.target as Element).getBoundingClientRect();
    const statusText = task.status === 'completed' ? 'Completed' : 
                      task.status === 'in-progress' ? 'In Progress' : 'Pending';
    
    setTooltipData({
      show: true,
      title: task.name || `Task ${index + 1}`,
      tagline: `${statusText}${task.phaseTitle ? ` • ${task.phaseTitle}` : ''}`,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      }
    });
    setAnimationsPaused(true);
  };

  const handleTooltipLeave = () => {
    setTooltipData(prev => ({ ...prev, show: false }));
    setAnimationsPaused(false);
  };

  return {
    tooltipData,
    animationsPaused,
    handleMilestoneHover,
    handleTaskHover,
    handleTooltipLeave
  };
}; 