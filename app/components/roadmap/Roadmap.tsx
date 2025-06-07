'use client';

import React, { useState, useRef } from 'react';
import {
  useNotionData,
  useViewportDimensions,
  useTooltipHandlers,
  useRoadmapPositions,
  useParallaxScroll,
  useRoadProgress
} from '@/app/hooks';
import { calculateProgress } from '@/app/utils';

import { RoadmapHeader } from './RoadmapHeader';
import { RoadmapBackground } from './RoadmapBackground';
import { RoadmapSVG } from './RoadmapSVG';
import { RoadmapControls } from './RoadmapControls';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export const Roadmap: React.FC = () => {
  // Data and loading states
  const { phaseData, loading, error, refresh } = useNotionData();
  
  // UI state
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1.5);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  // Custom hooks
  const viewportDimensions = useViewportDimensions();
  const {
    tooltipData,
    animationsPaused,
    handleMilestoneHover,
    handleTaskHover,
    handleTooltipLeave
  } = useTooltipHandlers();
  
  const {
    milestonePositions,
    taskDotPositions,
    launchPosition,
    currentDot
  } = useRoadmapPositions({
    pathRef,
    phaseData,
    circleRadius: 25
  });
  
  // Effect hooks
  useParallaxScroll({ containerRef });
  useRoadProgress({ phaseData });

  // Event handlers
  const handleMilestoneClick = (phase: number) => {
    setSelectedPhase(phase);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  // Calculate dimensions
  const roadmapWidth = 3600 * zoom;
  const roadmapHeight = viewportDimensions.height - 48;

  return (
    <>
      <RoadmapHeader onRefresh={refresh} />

      <div 
        ref={containerRef}
        className={`relative z-10 w-full h-screen overflow-x-auto overflow-y-hidden pt-12 ${animationsPaused ? 'animations-paused' : ''}`}
      >
        <RoadmapBackground 
          width={roadmapWidth} 
          height={roadmapHeight} 
        />

        <div 
          className="relative px-16 z-10" 
          style={{ 
            width: `${roadmapWidth}px`,
            minWidth: `${roadmapWidth}px`,
            height: `calc(100vh - 48px)`,
            minHeight: `calc(100vh - 48px)`
          }}
        >
          <RoadmapSVG
            pathRef={pathRef}
            svgRef={svgRef}
            zoom={zoom}
            milestonePositions={milestonePositions}
            taskDotPositions={taskDotPositions}
            currentDot={currentDot}
            launchPosition={launchPosition}
            phaseData={phaseData}
            onMilestoneClick={handleMilestoneClick}
            onMilestoneHover={(e, phase) => handleMilestoneHover(e, phase, phaseData)}
            onMilestoneLeave={handleTooltipLeave}
            onTaskHover={handleTaskHover}
            onTaskLeave={handleTooltipLeave}
          />
        </div>
      </div>

      <RoadmapControls
        tooltipData={tooltipData}
        selectedPhase={selectedPhase}
        phaseData={phaseData}
        onDrawerClose={() => setSelectedPhase(null)}
        onRefresh={refresh}
        progress={calculateProgress(phaseData)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        milestonePositions={milestonePositions}
        currentDot={currentDot}
        onMilestoneClick={handleMilestoneClick}
      />
    </>
  );
}; 