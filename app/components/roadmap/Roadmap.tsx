'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RoadmapPath } from './RoadmapPath';
import { Milestone } from './Milestone';
import { TaskDots } from './TaskDots';
import { CurrentPosition } from './CurrentPosition';
import { Tooltip } from './Tooltip';
import { SideDrawer } from './SideDrawer';
import { ProgressIndicator } from './ProgressIndicator';
import { ZoomControls } from './ZoomControls';
import { phaseData } from '@/app/data/roadmapData';
import { Milestone as MilestoneType, TaskDot } from '@/app/types/roadmap';

export const Roadmap: React.FC = () => {
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

  // Define milestones with positions along the curvy path
  const milestones: MilestoneType[] = [
    { id: 1, x: 100, y: 295, phase: 1, status: 'completed', critical: false },
    { id: 2, x: 450, y: 150, phase: 2, status: 'completed', critical: true },
    { id: 3, x: 750, y: 300, phase: 3, status: 'in-progress', critical: true },
    { id: 4, x: 1100, y: 300, phase: 4, status: 'pending', critical: false },
    { id: 5, x: 1400, y: 300, phase: 5, status: 'pending', critical: true },
    { id: 6, x: 1750, y: 500, phase: 6, status: 'pending', critical: true },
  ];

  // Define task dots along the path
  const taskDots: TaskDot[] = [
    // Phase 1 tasks
    { x: 150, y: 275, status: 'completed' },
    { x: 200, y: 240, status: 'completed' },
    { x: 250, y: 210, status: 'in-progress' },
    { x: 300, y: 180, status: 'pending' },
    
    // Phase 2 tasks
    { x: 500, y: 160, status: 'completed' },
    { x: 550, y: 180, status: 'completed' },
    { x: 600, y: 210, status: 'pending' },
    { x: 650, y: 240, status: 'pending' },
    
    // Phase 3 tasks
    { x: 800, y: 310, status: 'in-progress' },
    { x: 850, y: 305, status: 'pending' },
    { x: 900, y: 302, status: 'pending' },
    { x: 950, y: 300, status: 'pending' },

    // Phase 4 tasks
    { x: 1150, y: 298, status: 'pending' },
    { x: 1200, y: 299, status: 'pending' },
    { x: 1250, y: 300, status: 'pending' },

    // Phase 5 tasks
    { x: 1450, y: 320, status: 'pending' },
    { x: 1500, y: 340, status: 'pending' },
    { x: 1550, y: 370, status: 'pending' },

    // Phase 6 tasks
    { x: 1800, y: 480, status: 'pending' },
    { x: 1850, y: 460, status: 'pending' },
    { x: 1900, y: 440, status: 'pending' },
  ];

  // Current position (Phase 3)
  const currentPosition = { x: 750, y: 300 };

  // Calculate overall progress
  const calculateProgress = () => {
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
    
    return Math.round((completedTasks / totalTasks) * 100);
  };

  // Handle milestone click
  const handleMilestoneClick = (phase: number) => {
    setSelectedPhase(phase);
    
    // Smooth scroll to milestone
    const milestone = milestones.find(m => m.phase === phase);
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
      
      if (terrainBg) {
        terrainBg.style.transform = `translateX(${-scrollLeft * 0.3}px)`;
      }
      if (patternBg) {
        patternBg.style.transform = `translateX(${-scrollLeft * 0.5}px)`;
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
  }, []);

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
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-30 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Roadmap Journey</h1>
        <p className="text-sm text-gray-500 mt-1">CTM Platform Development</p>
      </header>

      {/* Roadmap Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-screen overflow-x-auto overflow-y-hidden pt-20"
      >
        <div className="relative min-w-max h-full px-16 py-8">
          <svg 
            ref={svgRef}
            className="roadmap-svg" 
            width="2400" 
            height="600" 
            viewBox="0 0 2400 600"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'left center' }}
          >
            <RoadmapPath />
            <TaskDots taskDots={taskDots} />
            
            {/* Milestones */}
            {milestones.map(milestone => (
              <Milestone
                key={milestone.id}
                milestone={milestone}
                dateRange={`${phaseData[milestone.phase].startDate.split(' ')[0]} ${phaseData[milestone.phase].startDate.split(' ')[1]} - ${phaseData[milestone.phase].endDate.split(' ')[0]} ${phaseData[milestone.phase].endDate.split(' ')[1]}`}
                onClick={handleMilestoneClick}
                onMouseEnter={handleMilestoneHover}
                onMouseLeave={() => setTooltipData(prev => ({ ...prev, show: false }))}
              />
            ))}
            
            {/* Current Position */}
            <CurrentPosition x={currentPosition.x} y={currentPosition.y} />
            
            {/* Destination */}
            <g>
              <circle cx="2300" cy="300" r="35" className="fill-blue-500 opacity-20" />
              <circle cx="2300" cy="300" r="25" className="fill-blue-500" />
              <text x="2300" y="305" className="fill-white text-sm font-bold" textAnchor="middle">
                Launch
              </text>
            </g>
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
      />
      <ProgressIndicator progress={calculateProgress()} />
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </>
  );
}; 