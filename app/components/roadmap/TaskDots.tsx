'use client';

import React from 'react';
import { TaskDot } from '@/app/types/roadmap';

interface TaskDotsProps {
  taskDots: TaskDot[];
}

export const TaskDots: React.FC<TaskDotsProps> = ({ taskDots }) => {
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
          className={`${getStatusClass(dot.status)} transition-all duration-200 hover:scale-150 cursor-pointer`}
        />
      ))}
    </>
  );
}; 