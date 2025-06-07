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
      {/* Enhanced Background effects with animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradientShift {
          0%, 100% { 
            background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(34, 197, 94, 0.2), rgba(251, 191, 36, 0.1));
          }
          33% { 
            background: linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(251, 191, 36, 0.2), rgba(239, 68, 68, 0.1));
          }
          66% { 
            background: linear-gradient(45deg, rgba(251, 191, 36, 0.3), rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.1));
          }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.8; }
        }
        .terrain-bg {
          animation: gradientShift 20s ease-in-out infinite;
        }
        .pattern-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
          animation: shimmer 8s ease-in-out infinite;
        }
      `}</style>
      
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          width: `${width}px`,
          minWidth: `${width}px`,
          height: `calc(100vh - 80px)`,
          top: '0'
        }}
      >
        <LandscapeBackground width={width} height={height} />
      </div>
    </>
  );
}; 