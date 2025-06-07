'use client';

import React from 'react';
import { Tooltip } from './Tooltip';
import { SideDrawer } from './SideDrawer';
import { ProgressIndicator } from './ProgressIndicator';
import { ZoomControls } from './ZoomControls';
import { MiniMap } from './MiniMap';
import { Milestone as MilestoneType, TaskDot, PhaseData } from '@/app/types/roadmap';

interface RoadmapControlsProps {
  // Tooltip props
  tooltipData: {
    show: boolean;
    title: string;
    tagline: string;
    position: { x: number; y: number };
  };
  
  // SideDrawer props
  selectedPhase: number | null;
  phaseData: Record<number, PhaseData>;
  onDrawerClose: () => void;
  onRefresh: () => void;
  
  // Progress props
  progress: number;
  
  // Zoom controls props
  onZoomIn: () => void;
  onZoomOut: () => void;
  
  // MiniMap props
  milestonePositions: MilestoneType[];
  currentDot: TaskDot | null;
  onMilestoneClick: (phase: number) => void;
}

export const RoadmapControls: React.FC<RoadmapControlsProps> = ({
  tooltipData,
  selectedPhase,
  phaseData,
  onDrawerClose,
  onRefresh,
  progress,
  onZoomIn,
  onZoomOut,
  milestonePositions,
  currentDot,
  onMilestoneClick
}) => {
  return (
    <>
      <Tooltip {...tooltipData} />
      
      <SideDrawer
        isOpen={selectedPhase !== null}
        phase={selectedPhase}
        phaseData={selectedPhase ? phaseData[selectedPhase] : null}
        onClose={onDrawerClose}
        onRefresh={onRefresh}
      />
      
      <ProgressIndicator progress={progress} />
      
      <ZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
      
      <MiniMap 
        milestones={milestonePositions}
        currentPosition={currentDot}
        onMilestoneClick={onMilestoneClick}
      />
    </>
  );
}; 