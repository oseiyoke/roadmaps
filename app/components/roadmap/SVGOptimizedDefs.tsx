'use client';

import React from 'react';

export const SVGOptimizedDefs: React.FC = () => {
  return (
    <defs>
      {/* Reusable task dot shapes */}
      <circle id="task-dot-base" r="6" />
      
      {/* Optimized gradients without heavy filters */}
      <linearGradient id="asphaltGradientOptimized" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4a5568', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#2d3748', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1a202c', stopOpacity: 1 }} />
      </linearGradient>
      
      {/* Simplified road texture pattern */}
      <pattern id="roadTextureSimple" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#2d3748"/>
        <circle cx="4" cy="4" r="1" fill="#4a5568" opacity="0.2"/>
      </pattern>
      
      {/* Milestone base shape */}
      <circle id="milestone-base" r="25" />
      
      {/* Vehicle wheel template */}
      <g id="vehicle-wheel">
        <circle r="4" className="fill-gray-800 stroke-gray-900 stroke-1"/>
        <circle r="2" className="fill-gray-600"/>
        <rect x="-1" y="-2" width="2" height="4" className="fill-gray-400"/>
      </g>
      
      {/* Simplified sparkle as static shape instead of animated */}
      <g id="sparkle-static">
        <circle r="1.5" className="fill-yellow-300" opacity="0.6"/>
      </g>
      
      {/* Pre-rendered shadow shapes */}
      <radialGradient id="shadow-gradient">
        <stop offset="0%" style={{ stopColor: '#000', stopOpacity: 0.3 }} />
        <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 0 }} />
      </radialGradient>
      
      {/* Optimized glow effect using gradients instead of filters */}
      <radialGradient id="glow-gradient">
        <stop offset="0%" style={{ stopColor: '#fff', stopOpacity: 0.8 }} />
        <stop offset="50%" style={{ stopColor: '#fff', stopOpacity: 0.3 }} />
        <stop offset="100%" style={{ stopColor: '#fff', stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}; 