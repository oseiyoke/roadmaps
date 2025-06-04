'use client';

import React from 'react';

interface CurrentPositionProps {
  x: number;
  y: number;
}

export const CurrentPosition: React.FC<CurrentPositionProps> = ({ x, y }) => {
  return (
    <g className="current-position-marker">
      {/* Pulsing circle animation */}
      {/* Main position dot */}
      <circle 
        cx={x} 
        cy={y} 
        r="8" 
        className="fill-blue-500 drop-shadow-lg"
      />
      
      {/* "You are here" text */}
      <rect 
        x={x - 45} 
        y={y - 25} 
        width="90" 
        height="20" 
        rx="10" 
        className="fill-blue-500"
      />
      <text 
        x={x} 
        y={y - 10} 
        className="fill-white text-[10px] font-bold pointer-events-none"
        textAnchor="middle"
      >
        YOU ARE HERE
      </text>
    </g>
  );
}; 