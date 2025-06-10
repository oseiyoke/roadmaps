'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  useNotionData,
  useViewportDimensions,
  useTooltipHandlers,
  useRoadmapPositions,
  useParallaxScroll,
  useRoadProgress
} from '@/app/hooks';
import { calculateProgress } from '@/app/utils';
import { getOptimalRenderingConfig } from '@/app/utils/featureDetection';

import { RoadmapHeader } from './RoadmapHeader';
import { RoadmapBackground } from './RoadmapBackground';
import { RoadmapSVG } from './RoadmapSVG';
import { RoadmapHybrid } from './RoadmapHybrid';
import { RoadmapControls } from './RoadmapControls';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

export const Roadmap: React.FC = () => {
  // Data and loading states
  const { phaseData, loading, error, refresh } = useNotionData();
  
  // Feature detection
  const [renderConfig, setRenderConfig] = useState({
    useHybridRendering: false,
    useFilters: true,
    sparkleCount: 10,
    enableParallax: true,
    enableAnimations: true
  });
  
  useEffect(() => {
    // Run feature detection on client side only
    setRenderConfig(getOptimalRenderingConfig());
  }, []);
  
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
  useParallaxScroll({ 
    containerRef,
    enabled: renderConfig.enableParallax 
  });
  useRoadProgress({ phaseData });

  // Event handlers
  const handleMilestoneClick = useCallback((phase: number) => {
    setSelectedPhase(phase);
  }, [phaseData]);

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
  const baseWidth = 3600;
  const padding = 64; // px-16 = 64px per side
  const extraSpace = 200; // Extra space at the end for launch area
  const containerWidth = (baseWidth + padding * 2 + extraSpace) * zoom; // Account for padding and extra space
  const roadmapHeight = viewportDimensions.height - 48;

  // Common props for both rendering approaches
  const roadmapProps = {
    pathRef,
    svgRef,
    zoom,
    milestonePositions,
    taskDotPositions,
    currentDot,
    launchPosition,
    phaseData,
    onMilestoneClick: handleMilestoneClick,
    onMilestoneHover: (e: React.MouseEvent, phase: number) => handleMilestoneHover(e, phase, phaseData),
    onMilestoneLeave: handleTooltipLeave,
    onTaskHover: handleTaskHover,
    onTaskLeave: handleTooltipLeave
  };

  return (
    <>
      <RoadmapHeader onRefresh={refresh} />

      <div 
        ref={containerRef}
        className={`relative z-10 w-full h-screen overflow-x-auto overflow-y-hidden pt-12 ${
          animationsPaused || !renderConfig.enableAnimations ? 'animations-paused' : ''
        }`}
      >
        <RoadmapBackground 
          width={containerWidth} 
          height={roadmapHeight} 
        />

        <div 
          className="relative px-16 z-10" 
          style={{ 
            width: `${containerWidth}px`,
            minWidth: `${containerWidth}px`,
            height: `calc(100vh - 48px)`,
            minHeight: `calc(100vh - 48px)`
          }}
        >
          {renderConfig.useHybridRendering ? (
            <RoadmapHybrid {...roadmapProps} />
          ) : (
            <RoadmapSVG {...roadmapProps} />
          )}
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