'use client';

import React from 'react';
import { RoadmapPath } from './RoadmapPath';
import { Milestone } from './Milestone';
import { TaskDots } from './TaskDots';
import { Vehicle } from './Vehicle';
import { roadmapCurvePoints } from '@/app/data/roadmapData';
import { Milestone as MilestoneType, TaskDot, PhaseData } from '@/app/types/roadmap';

interface RoadmapSVGProps {
  pathRef: React.RefObject<SVGPathElement | null>;
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
}

export const RoadmapSVG: React.FC<RoadmapSVGProps> = ({
  pathRef,
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
  onTaskLeave
}) => {
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = startDate.split(' ');
    const end = endDate.split(' ');
    return `${start[0]} ${start[1]} - ${end[0]} ${end[1]}`;
  };

  return (
    <svg 
      ref={svgRef}
      className="roadmap-svg" 
      width="3600" 
      height="700" 
      viewBox="0 0 3800 700"
      style={{ 
        transformOrigin: 'left center',
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: `translateY(-50%) scale(${zoom})`
      }}
    >
      <RoadmapPath ref={pathRef} points={roadmapCurvePoints} />
      
      {/* Milestones */}
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
      
      {/* Task dots rendered after milestones so they appear on top */}
      <TaskDots 
        taskDots={taskDotPositions} 
        onTaskHover={onTaskHover}
        onTaskLeave={onTaskLeave}
      />
      
      {/* Vehicle Position (last in-progress task) */}
      {currentDot && (
        <Vehicle x={currentDot.x} y={currentDot.y} />
      )}
      
      {/* Launch (dynamic) */}
      <g>
        <circle
          cx={launchPosition.x}
          cy={launchPosition.y}
          r="35"
          className="fill-blue-500 opacity-20"
        />
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
          
        </text>
      </g>
    </svg>
  );
}; 