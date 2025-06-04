'use client';

import React, { useEffect, useState } from 'react';
import { TaskDot } from '@/app/types/roadmap';

interface TaskDotsProps {
  taskDots: TaskDot[];
}

export const TaskDots: React.FC<TaskDotsProps> = ({ taskDots }) => {
  const [computedDots, setComputedDots] = useState<TaskDot[]>(taskDots);

  useEffect(() => {
    const path = document.querySelector<SVGPathElement>('#roadPath');
    if (!path) {
      setComputedDots(taskDots);
      return;
    }
    const totalLength = path.getTotalLength();
    const startPoint = path.getPointAtLength(0);
    const endPoint = path.getPointAtLength(totalLength);
    const minX = startPoint.x;
    const maxX = endPoint.x;

    const newDots: TaskDot[] = taskDots.map(dot => {
      const fraction = (dot.x - minX) / (maxX - minX);
      const clampedFraction = Math.max(0, Math.min(1, fraction));
      const lengthAlong = clampedFraction * totalLength;
      const point = path.getPointAtLength(lengthAlong);
      return { x: point.x, y: point.y, status: dot.status };
    });
    setComputedDots(newDots);
  }, [taskDots]);

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
      {computedDots.map((dot, index) => (
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