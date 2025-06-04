'use client';

import React from 'react';

interface CurrentPositionProps {
  x: number;
  y: number;
}

export const CurrentPosition: React.FC<CurrentPositionProps> = ({ x, y }) => {
  return (
    <>
      {/* Custom subtle bounce animation */}
      <style jsx global>{`
        @keyframes subtleBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .subtle-bounce {
          animation: subtleBounce 2s ease-in-out infinite;
        }
      `}</style>
      
      <g className="current-position-marker">
        {/* Marker shadow (stays in place) */}
        <ellipse 
          cx={x} 
          cy={y + 8} 
          rx="5" 
          ry="2" 
          className="fill-black opacity-20"
        />
        
        {/* Main bouncing marker - positioned exactly on the task dot */}
        <g className="subtle-bounce" style={{ transformOrigin: `${x}px ${y}px` }}>
          {/* Marker pin shape - smaller and narrower */}
          <path
            d={`M ${x} ${y - 12} 
                C ${x - 5} ${y - 12}, ${x - 9} ${y - 8}, ${x - 9} ${y - 3}
                C ${x - 9} ${y + 2}, ${x} ${y + 8}, ${x} ${y + 10}
                C ${x} ${y + 6}, ${x + 9} ${y + 2}, ${x + 9} ${y - 3}
                C ${x + 9} ${y - 8}, ${x + 5} ${y - 12}, ${x} ${y - 12} Z`}
            className="fill-red-500 stroke-red-600 stroke-1 drop-shadow-sm"
          />
          
          {/* Marker inner circle - smaller */}
          <circle
            cx={x}
            cy={y - 5}
            r="4"
            className="fill-white"
          />
          
          {/* Marker center dot - smaller */}
          <circle
            cx={x}
            cy={y - 5}
            r="2"
            className="fill-red-500"
          />
        </g>
      </g>
    </>
  );
}; 