'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RoadmapPath } from './RoadmapPath';
import { Milestone } from './Milestone';
import { TaskDots } from './TaskDots';
import { CurrentPosition } from './CurrentPosition';
import { Tooltip } from './Tooltip';
import { SideDrawer } from './SideDrawer';
import { ProgressIndicator } from './ProgressIndicator';
import { ZoomControls } from './ZoomControls';
import { LandscapeBackground } from './LandscapeBackground';
import { roadmapCurvePoints } from '@/app/data/roadmapData';
import { Milestone as MilestoneType, TaskDot } from '@/app/types/roadmap';
import { useNotionData } from '@/app/hooks/useNotionData';

export const Roadmap: React.FC = () => {
  const { phaseData, loading, error, refresh } = useNotionData();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    show: boolean;
    title: string;
    tagline: string;
    position: { x: number; y: number };
  }>({ show: false, title: '', tagline: '', position: { x: 0, y: 0 } });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [milestonePositions, setMilestonePositions] = useState<MilestoneType[]>([]);
  const [taskDotPositions, setTaskDotPositions] = useState<TaskDot[]>([]);
  const [launchPosition, setLaunchPosition] = useState<{ x: number; y: number } | null>(null);
  const [viewportDimensions, setViewportDimensions] = useState({ width: 1920, height: 1080 });
  // Calculate dynamic background width for scrolling
  const circleRadius = 25;
  const svgEndMargin = circleRadius * 2;
  const lastPointX = roadmapCurvePoints[roadmapCurvePoints.length - 1].x;
  const svgWidth = lastPointX + svgEndMargin;
  // Update viewport dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Derive current position from the last in-progress task dot
  const currentDot = useMemo(() => {
    return taskDotPositions.filter(dot => dot.status === 'in-progress').pop() ?? null;
  }, [taskDotPositions]);

  // Compute dynamic positions for milestones and task dots once the path is rendered
  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || !phaseData || Object.keys(phaseData).length === 0) return;
    const totalLength = pathEl.getTotalLength();
    const phases = Object.keys(phaseData)
      .map(k => Number(k))
      .sort((a, b) => a - b);

    console.log("phases in roadmap", phases);
    // Compute segment ratios based on task counts with a floor to ensure minimum spacing
    const taskCounts = phases.map(p => phaseData[p].tasks.length);
    const totalTasksCount = taskCounts.reduce((sum, c) => sum + c, 0) || 1;
    // Default equal share per phase
    const defaultRatio = 1 / phases.length;
    // Minimum ratio floor (e.g., half of equal spacing)
    const minRatio = defaultRatio * 0.5;
    // Raw ratios from task counts
    const rawRatios = taskCounts.map(c => c / totalTasksCount);
    // Apply minimum floor and normalize
    const adjusted = rawRatios.map(r => Math.max(r, minRatio));
    const sumAdjusted = adjusted.reduce((sum, r) => sum + r, 0) || 1;
    const ratios = adjusted.map(r => r / sumAdjusted);
    // Compute cumulative start ratios
    const cumulativeRatios: number[] = [];
    ratios.reduce((acc, r, idx) => { cumulativeRatios[idx] = acc; return acc + r; }, 0);

    // Add padding between phases to improve spacing
    const margin = circleRadius * 2;
    const effectiveLength = totalLength - margin * (phases.length - 1);

    // Milestone positions at segment starts
    const milestonePos = phases.map((phase, i) => {
      const startLen = (cumulativeRatios[i] * effectiveLength) + (margin * i);
      const { x, y } = pathEl.getPointAtLength(startLen);
      const data = phaseData[phase];
      const status: MilestoneType['status'] = phaseData[phase].status as MilestoneType['status']
      
      return { id: phase, x, y, phase, status, critical: data.critical };
    });
    setMilestonePositions(milestonePos);

    // Task dot positions
    const dots: TaskDot[] = [];
    const milestonePositions: { x: number; y: number }[] = [];
    
    // First, calculate milestone positions for collision detection
    phases.forEach((phase, pi) => {
      const startLen = (cumulativeRatios[pi] * effectiveLength) + (margin * pi);
      const { x, y } = pathEl.getPointAtLength(startLen);
      milestonePositions.push({ x, y });
    });
    
    phases.forEach((phase, pi) => {
      const tasks = phaseData[phase].tasks;
      const M = tasks.length;
      const segmentStart = cumulativeRatios[pi] * effectiveLength + margin * pi;
      const segmentLen = ratios[pi] * effectiveLength;
      const milestonePos = milestonePositions[pi];
      const milestoneRadius = circleRadius + 5; // Add buffer around milestone
      
      tasks.forEach((task, ki) => {
        const frac = (ki + 1) / (M + 1);
        let pos = pathEl.getPointAtLength(segmentStart + segmentLen * frac);
        
        // Check if task dot would overlap with milestone and adjust position
        const distanceToMilestone = Math.sqrt(
          Math.pow(pos.x - milestonePos.x, 2) + Math.pow(pos.y - milestonePos.y, 2)
        );
        
        // If too close to milestone, move it further along the path
        if (distanceToMilestone < milestoneRadius) {
          const adjustedFrac = frac + 0.15; // Move 15% further along the segment
          if (adjustedFrac <= 1) {
            pos = pathEl.getPointAtLength(segmentStart + segmentLen * adjustedFrac);
          }
        }
        
        dots.push({ x: pos.x, y: pos.y, status: task.status });
      });
    });
    setTaskDotPositions(dots);

    // Launch position at end of path
    const endPoint = pathEl.getPointAtLength(totalLength);
    setLaunchPosition({ x: endPoint.x, y: endPoint.y });
  }, [phaseData]);

  // Calculate overall progress
  const calculateProgress = () => {
    if (!phaseData || Object.keys(phaseData).length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    Object.values(phaseData).forEach(phase => {
      phase.tasks.forEach(task => {
        totalTasks++;
        if (task.status === 'completed') {
          completedTasks++;
        }
      });
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  // Handle milestone click
  const handleMilestoneClick = (phase: number) => {
    setSelectedPhase(phase);
    
    // Smooth scroll to milestone
    const milestone = milestonePositions.find(m => m.phase === phase);
    if (milestone && containerRef.current) {
      const targetX = milestone.x * zoom - window.innerWidth / 2;
      
      containerRef.current.scrollTo({
        left: targetX,
        behavior: 'smooth'
      });
    }
  };

  // Handle milestone hover
  const handleMilestoneHover = (e: React.MouseEvent, phase: number) => {
    const data = phaseData[phase];
    if (data && svgRef.current) {
      const rect = (e.target as Element).getBoundingClientRect();
      setTooltipData({
        show: true,
        title: data.title,
        tagline: data.tagline,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.bottom + 10
        }
      });
    }
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Parallax effect for background
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const terrainBg = document.querySelector('.terrain-bg') as HTMLElement;
      const patternBg = document.querySelector('.pattern-bg') as HTMLElement;
      const landscapeFar = document.querySelector('.landscape-layer-far') as HTMLElement;
      const landscapeMid = document.querySelector('.landscape-layer-mid') as HTMLElement;
      const landscapeNear = document.querySelector('.landscape-layer-near') as HTMLElement;
      const landscapeAccent = document.querySelector('.landscape-layer-accent') as HTMLElement;
      const cloudsFar = document.querySelector('.clouds-far') as HTMLElement;
      const cloudsMid = document.querySelector('.clouds-mid') as HTMLElement;
      const cloudsNear = document.querySelector('.clouds-near') as HTMLElement;
      
      if (terrainBg) {
        terrainBg.style.transform = `translateX(${-scrollLeft * 0.3}px)`;
      }
      if (patternBg) {
        patternBg.style.transform = `translateX(${-scrollLeft * 0.5}px)`;
      }
      // Landscape layers with different parallax speeds
      if (landscapeFar) {
        landscapeFar.style.transform = `translateX(${-scrollLeft * 0.2}px)`;
      }
      if (landscapeMid) {
        landscapeMid.style.transform = `translateX(${-scrollLeft * 0.35}px)`;
      }
      if (landscapeNear) {
        landscapeNear.style.transform = `translateX(${-scrollLeft * 0.45}px)`;
      }
      if (landscapeAccent) {
        landscapeAccent.style.transform = `translateX(${-scrollLeft * 0.55}px)`;
      }
      // Cloud layers with different parallax speeds
      if (cloudsFar) {
        cloudsFar.style.transform = `translateX(${-scrollLeft * 0.1}px)`;
      }
      if (cloudsMid) {
        cloudsMid.style.transform = `translateX(${-scrollLeft * 0.15}px)`;
      }
      if (cloudsNear) {
        cloudsNear.style.transform = `translateX(${-scrollLeft * 0.25}px)`;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Update road progress
  useEffect(() => {
    const progress = calculateProgress();
    const roadProgress = document.querySelector('.road-progress') as SVGPathElement;
    if (roadProgress) {
      const pathLength = roadProgress.getTotalLength();
      const offset = pathLength - (pathLength * progress / 100);
      roadProgress.style.strokeDasharray = `${pathLength}`;
      roadProgress.style.strokeDashoffset = `${offset}`;
    }
  }, [phaseData]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roadmap from Notion...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Roadmap</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background effects */}
      <div className="terrain-bg fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-green-400/20 to-yellow-400/10" />
      </div>
      
      <div className="pattern-bg fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, #d1d5db 80px, #d1d5db 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, #d1d5db 80px, #d1d5db 81px)
          `
        }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4 text-center justify-center">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Seamless</h1>
          {/* <button
            onClick={refresh}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Refresh from Notion"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button> */}
        </div>
      </header>

      {/* Roadmap Container */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full h-screen overflow-x-auto overflow-y-hidden pt-20"
      >
        <div className="relative min-w-max h-full px-16">
          {/* Landscape Background - scrollable parallax */}
          <div className="landscape-container absolute inset-0 pointer-events-none">
            <LandscapeBackground width={svgWidth} height={viewportDimensions.height} />
          </div>
          <svg 
            ref={svgRef}
            className="roadmap-svg" 
            width="3600" 
            height="700" 
            viewBox="0 0 3800 700"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'left center' }}
          >
            <RoadmapPath ref={pathRef} points={roadmapCurvePoints} />
            
            {/* Milestones */}
            {milestonePositions.map(milestone => (
              <Milestone
                key={milestone.id}
                milestone={milestone}
                dateRange={phaseData[milestone.phase] ? 
                  `${phaseData[milestone.phase].startDate.split(' ')[0]} ${phaseData[milestone.phase].startDate.split(' ')[1]} - ${phaseData[milestone.phase].endDate.split(' ')[0]} ${phaseData[milestone.phase].endDate.split(' ')[1]}` : 
                  ''
                }
                onClick={handleMilestoneClick}
                onMouseEnter={handleMilestoneHover}
                onMouseLeave={() => setTooltipData(prev => ({ ...prev, show: false }))}
              />
            ))}
            
            {/* Task dots rendered after milestones so they appear on top */}
            <TaskDots taskDots={taskDotPositions} />
            
            {/* Current Position (last in-progress task) */}
            {currentDot && (
              <CurrentPosition x={currentDot.x} y={currentDot.y} />
            )}
            
            {/* Launch (dynamic) */}
            {launchPosition && (
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
            )}
          </svg>
        </div>
      </div>

      {/* UI Components */}
      <Tooltip {...tooltipData} />
      <SideDrawer
        isOpen={selectedPhase !== null}
        phase={selectedPhase}
        phaseData={selectedPhase ? phaseData[selectedPhase] : null}
        onClose={() => setSelectedPhase(null)}
        onRefresh={refresh}
      />
      <ProgressIndicator progress={calculateProgress()} />
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </>
  );
}; 