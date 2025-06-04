'use client';

import React from 'react';

interface RoadmapPathProps {
  pathId?: string;
}

export const RoadmapPath: React.FC<RoadmapPathProps> = ({ pathId = 'roadPath' }) => {
  // Create a smooth, curvy path using cubic bezier curves
  const pathData = `
    M 50 300 
    C 200 300, 300 100, 450 150
    S 650 250, 750 300
    C 900 350, 1000 350, 1100 300
    S 1300 250, 1400 300
    C 1550 350, 1650 450, 1750 500
    S 1950 450, 2100 300
    C 2200 250, 2250 300, 2350 300
  `;

  return (
    <>
      {/* Define gradients */}
      <defs>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#e5e7eb', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#e5e7eb', stopOpacity: 1 }} />
        </linearGradient>
        
        <filter id="roadShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.1"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Road layers for depth */}
      <g filter="url(#roadShadow)">
        {/* Road border (darker outline) */}
        <path 
          id={pathId} 
          d={pathData}
          className="fill-none stroke-gray-900 stroke-[84] rounded-full"
          strokeLinecap="round"
        />
        
        {/* Main road surface */}
        <path 
          d={pathData}
          className="fill-none stroke-gray-700 stroke-[80] rounded-full"
          strokeLinecap="round"
        />
        
        {/* Road progress overlay */}
        <path 
          d={pathData}
          className="road-progress fill-none stroke-blue-400 stroke-[80] rounded-full opacity-20"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset="600"
        />
        
        {/* Road center line (dashed yellow) */}
        <path 
          d={pathData}
          className="fill-none stroke-yellow-400 stroke-[3] rounded-full"
          strokeLinecap="round"
          strokeDasharray="20 15"
        />
        
        {/* Road edge lines (white) */}
        <path 
          d={pathData}
          className="fill-none stroke-white stroke-[2] rounded-full"
          strokeLinecap="round"
          transform="translate(0,-38)"
        />
        <path 
          d={pathData}
          className="fill-none stroke-white stroke-[2] rounded-full"
          strokeLinecap="round"
          transform="translate(0,38)"
        />
      </g>
    </>
  );
}; 