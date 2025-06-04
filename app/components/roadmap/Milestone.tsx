'use client';

import React from 'react';
import { Milestone as MilestoneType } from '@/app/types/roadmap';

interface MilestoneProps {
  milestone: MilestoneType;
  dateRange: string;
  onClick: (phase: number) => void;
  onMouseEnter: (e: React.MouseEvent, phase: number) => void;
  onMouseLeave: () => void;
}

export const Milestone: React.FC<MilestoneProps> = ({
  milestone,
  dateRange,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const getStatusClasses = () => {
    const baseClasses = "transition-all duration-300 cursor-pointer";
    
    if (milestone.status === 'completed') {
      return milestone.critical 
        ? `${baseClasses} fill-yellow-400 stroke-green-500` 
        : `${baseClasses} fill-green-500 stroke-green-500`;
    }
    
    if (milestone.status === 'in-progress') {
      return milestone.critical 
        ? `${baseClasses} fill-yellow-400 stroke-orange-500` 
        : `${baseClasses} fill-orange-500 stroke-orange-500`;
    }
    
    return milestone.critical 
      ? `${baseClasses} fill-white stroke-gray-300` 
      : `${baseClasses} fill-white stroke-gray-300`;
  };

  const radius = 25;

  return (
    <g 
      className="milestone group"
      onClick={() => onClick(milestone.phase)}
      onMouseEnter={(e) => onMouseEnter(e, milestone.phase)}
      onMouseLeave={onMouseLeave}
    >
      {/* Glow effect for critical milestones */}
      {/* Main milestone circle */}
      <circle 
        cx={milestone.x} 
        cy={milestone.y} 
        r={radius}
        className={`${getStatusClasses()} stroke-[3] hover:filter hover:drop-shadow-lg`}
      />
      
      {/* Phase number */}
      <text 
        x={milestone.x} 
        y={milestone.y + 5} 
        className="fill-white font-bold text-lg pointer-events-none"
        textAnchor="middle"
      >
        {milestone.phase}
      </text>
      
      {/* Date range */}
      <text 
        x={milestone.x} 
        y={milestone.y + (milestone.y < 300 ? -45 : 45)} 
        className=" hidden fill-gray-500 text-xs pointer-events-none"
        textAnchor="middle"
      >
        {dateRange}
      </text>
    </g>
  );
}; 