'use client';

import React from 'react';
import { LandscapeBackground } from './LandscapeBackground';

interface RoadmapBackgroundProps {
  width: number;
  height: number;
}

export const RoadmapBackground: React.FC<RoadmapBackgroundProps> = ({ width, height }) => {
  return (
    <>
      {/* Simplified background animations for better Safari performance */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { 
            background-position: 0% 50%;
          }
          50% { 
            background-position: 100% 50%;
          }
        }
        .terrain-bg {
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.1));
          animation: gradientShift 30s ease-in-out infinite;
          background-size: 200% 200%;
        }
      `}</style>
      
      <div 
        className="absolute z-0 pointer-events-none terrain-bg"
        style={{ 
          width: `${width}px`,
          minWidth: `${width}px`,
          height: `calc(100vh - 80px)`,
          top: '0',
          left: '-64px', // Offset to account for parent padding
          right: '-64px'
        }}
      >
        <LandscapeBackground width={width} height={height} />
      </div>
    </>
  );
}; 