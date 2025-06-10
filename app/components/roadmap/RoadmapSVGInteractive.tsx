'use client';

import React from 'react';
import { Milestone } from './Milestone';
import { TaskDots } from './TaskDots';
import { Vehicle } from './Vehicle';
import { SVGOptimizedDefs } from './SVGOptimizedDefs';
import { Milestone as MilestoneType, TaskDot, PhaseData } from '@/app/types/roadmap';

interface RoadmapSVGInteractiveProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  zoom: number;
  milestonePositions: MilestoneType[];
  taskDotPositions: TaskDot[];
  currentDot: TaskDot | null;
  launchPosition: { x: number; y: number };
  phaseData: Record<number, PhaseData>;
  onMilestoneClick: (phase: number) => void;
  onMilestoneHover: (e: React.MouseEvent, phase: number) => void;
  onMilestoneLeave: () => void;
  onTaskHover: (e: React.MouseEvent, task: TaskDot, index: number) => void;
  onTaskLeave: () => void;
  width?: number;
}

export const RoadmapSVGInteractive: React.FC<RoadmapSVGInteractiveProps> = ({
  svgRef,
  zoom,
  milestonePositions,
  taskDotPositions,
  currentDot,
  launchPosition,
  phaseData,
  onMilestoneClick,
  onMilestoneHover,
  onMilestoneLeave,
  onTaskHover,
  onTaskLeave,
  width = 3600
}) => {
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = startDate.split(' ');
    const end = endDate.split(' ');
    return `${start[0]} ${start[1]} - ${end[0]} ${end[1]}`;
  };

  return (
    <svg 
      ref={svgRef}
      className="roadmap-svg-interactive absolute inset-0" 
      width={width} 
      height="700" 
      viewBox={`0 0 ${width} 700`}
      style={{ 
        transformOrigin: 'left center',
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: `translateY(-50%) scale(${zoom})`,
        pointerEvents: 'none' // Disable on svg, enable on individual elements
      }}
    >
      {/* Include optimized definitions */}
      <SVGOptimizedDefs />
      
      {/* Milestones - enable pointer events */}
      <g style={{ pointerEvents: 'auto' }}>
        {milestonePositions.map(milestone => (
          <Milestone
            key={milestone.id}
            milestone={milestone}
            dateRange={phaseData[milestone.phase] ? 
              formatDateRange(
                phaseData[milestone.phase].startDate,
                phaseData[milestone.phase].endDate
              ) : ''
            }
            onClick={onMilestoneClick}
            onMouseEnter={onMilestoneHover}
            onMouseLeave={onMilestoneLeave}
          />
        ))}
      </g>
      
      {/* Task dots - enable pointer events */}
      <g style={{ pointerEvents: 'auto' }}>
        <TaskDots 
          taskDots={taskDotPositions} 
          onTaskHover={onTaskHover}
          onTaskLeave={onTaskLeave}
        />
      </g>
      
      {/* Vehicle Position (non-interactive) */}
      {currentDot && (
        <Vehicle x={currentDot.x} y={currentDot.y} />
      )}
      
      {/* Launch marker - simplified */}
      <g>
        {/* Shadow */}
        <ellipse
          cx={launchPosition.x}
          cy={launchPosition.y + 2}
          rx="27"
          ry="4"
          fill="url(#shadow-gradient)"
          opacity="0.3"
        />
        {/* Outer glow using gradient instead of multiple circles */}
        <circle
          cx={launchPosition.x}
          cy={launchPosition.y}
          r="30"
          fill="url(#glow-gradient)"
          opacity="0.3"
        />
        {/* Main circle */}
        <circle
          cx={launchPosition.x}
          cy={launchPosition.y}
          r="25"
          className="fill-blue-500"
        />
        <text
          x={launchPosition.x}
          y={launchPosition.y + 5}
          className="fill-white text-sm font-bold"
          textAnchor="middle"
        >
          🚀
        </text>
      </g>
    </svg>
  );
}; 