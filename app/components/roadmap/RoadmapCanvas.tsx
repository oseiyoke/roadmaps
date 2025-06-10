'use client';

import React, { useRef, useEffect } from 'react';
import { renderRoadCanvas } from '@/app/utils/renderRoadCanvas';

interface RoadmapCanvasProps {
  width: number;
  height: number;
  zoom: number;
  curvePoints: { x: number; y: number }[];
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  width,
  height,
  zoom,
  curvePoints
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    renderRoadCanvas(canvas, {
      width,
      height,
      zoom,
      curvePoints
    });
  }, [width, height, zoom, curvePoints]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transformOrigin: 'left center',
        transform: `translateY(-50%) scale(${zoom})`,
        top: '50%',
        left: 0,
        position: 'absolute'
      }}
    />
  );
}; 