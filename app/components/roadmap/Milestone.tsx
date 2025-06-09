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
    
    // If there's an icon, use a more subtle background
    const hasIcon = milestone.icon;
    
    if (milestone.status === 'completed') {
        return `${baseClasses} ${hasIcon ? 'fill-green-100 stroke-green-500' : 'fill-green-500 stroke-green-500'}`;
    }
    
    if (milestone.status === 'in-progress') {
      return `${baseClasses} ${hasIcon ? 'fill-orange-100 stroke-orange-500' : 'fill-orange-500 stroke-orange-500'}`;
    }
    
    return `${baseClasses} ${hasIcon ? 'fill-gray-50 stroke-gray-400' : 'fill-white stroke-gray-300'}`;
  };

  const radius = 25;

  // Optimized Icon Component using <image> instead of foreignObject
  const NotionIconComponent = () => {
    if (!milestone.icon) return null;

    const iconSize = 30;
    const iconX = milestone.x - iconSize / 2;
    const iconY = milestone.y - iconSize / 2;

    if (milestone.icon.type === 'emoji' && milestone.icon.emoji) {
      return (
        <text
          x={milestone.x}
          y={milestone.y + 6} // Slight offset to center emoji visually
          className="pointer-events-none"
          textAnchor="middle"
          fontSize="24"
        >
          {milestone.icon.emoji}
        </text>
      );
    }

    if ((milestone.icon.type === 'external' || milestone.icon.type === 'file') && 
        (milestone.icon.external?.url || milestone.icon.file?.url)) {
      const imageUrl = milestone.icon.external?.url || milestone.icon.file?.url;
      
      // Use <image> instead of foreignObject for better Safari compatibility
      return (
        <image
          x={iconX}
          y={iconY}
          width={iconSize}
          height={iconSize}
          href={imageUrl}
          className="pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        />
      );
    }

    return null;
  };

  return (
    <g 
      className="milestone group"
      onClick={() => onClick(milestone.phase)}
      onMouseEnter={(e) => onMouseEnter(e, milestone.phase)}
      onMouseLeave={onMouseLeave}
    >
      {/* Subtle shadow using gradient instead of filter */}
      <ellipse
        cx={milestone.x}
        cy={milestone.y + 2}
        rx={radius + 2}
        ry={4}
        fill="url(#shadow-gradient)"
        opacity="0.3"
      />
      
      {/* Main milestone circle using reusable shape */}
      <use
        href="#milestone-base"
        x={milestone.x}
        y={milestone.y}
        className={`${getStatusClasses()} stroke-[3]`}
      />
      
      {/* Notion Icon overlay for all phases */}
      <NotionIconComponent />
      
      {/* Date range - hidden by default to reduce clutter */}
      <text 
        x={milestone.x} 
        y={milestone.y + (milestone.y < 300 ? -45 : 45)} 
        className="hidden fill-gray-500 text-xs pointer-events-none"
        textAnchor="middle"
      >
        {dateRange}
      </text>
    </g>
  );
}; 