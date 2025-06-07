'use client';

import React from 'react';
import { TaskDot } from '@/app/types/roadmap';

interface TaskDotsProps {
  taskDots: TaskDot[];
  onTaskHover?: (e: React.MouseEvent, task: TaskDot, index: number) => void;
  onTaskLeave?: () => void;
}

export const TaskDots: React.FC<TaskDotsProps> = ({ taskDots, onTaskHover, onTaskLeave }) => {
  const getStatusClass = (status: TaskDot['status']) => {
    switch (status) {
      case 'completed':
        return 'fill-green-500';
      case 'in-progress':
        return 'fill-orange-500';
      default:
        return 'fill-gray-300';
    }
  };

  return (
    <>
      {taskDots.map((dot, index) => (
        <circle
          key={index}
          cx={dot.x}
          cy={dot.y}
          r="6"
          className={`${getStatusClass(dot.status)} transition-all duration-200 cursor-pointer hover:stroke-2 hover:stroke-white hover:drop-shadow-lg`}
          onMouseEnter={(e) => onTaskHover?.(e, dot, index)}
          onMouseLeave={onTaskLeave}
        />
      ))}
    </>
  );
}; 