'use client';

import React from 'react';
import { RoadmapCanvas } from './RoadmapCanvas';
import { RoadmapSVGInteractive } from './RoadmapSVGInteractive';
import { roadmapCurvePoints } from '@/app/utils/roadmapCurvePoints';
import { Milestone as MilestoneType, TaskDot, PhaseData } from '@/app/types/roadmap';
import { line, curveCatmullRom } from 'd3-shape';

interface RoadmapHybridProps {
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

export const RoadmapHybrid: React.FC<RoadmapHybridProps> = (props) => {
  const {
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
  } = props;

  // Generate path data for the hidden SVG path
  const pathGenerator = line<{ x: number; y: number }>()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curveCatmullRom.alpha(0.7));
  const pathData = pathGenerator(roadmapCurvePoints) || '';
  
  // Add extra width for the launch area
  const canvasWidth = 3800; // Extended from 3600 to give space for launch

  return (
    <div className="relative w-full h-full">
      {/* Hidden SVG for path calculations - must match the visible path exactly */}
      <svg 
        className="absolute invisible pointer-events-none" 
        width={canvasWidth} 
        height="700"
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)'
        }}
      >
        <path 
          ref={pathRef} 
          d={pathData}
          id="roadPath"
        />
      </svg>
      
      {/* Canvas layer for road rendering - positioned identically to SVG */}
      <RoadmapCanvas
        width={canvasWidth}
        height={700}
        zoom={zoom}
        curvePoints={roadmapCurvePoints}
      />
      
      {/* SVG layer for interactive elements - overlays the Canvas exactly */}
      <RoadmapSVGInteractive
        svgRef={svgRef}
        zoom={zoom}
        milestonePositions={milestonePositions}
        taskDotPositions={taskDotPositions}
        currentDot={currentDot}
        launchPosition={launchPosition}
        phaseData={phaseData}
        onMilestoneClick={onMilestoneClick}
        onMilestoneHover={onMilestoneHover}
        onMilestoneLeave={onMilestoneLeave}
        onTaskHover={onTaskHover}
        onTaskLeave={onTaskLeave}
        width={canvasWidth}
      />
    </div>
  );
}; 