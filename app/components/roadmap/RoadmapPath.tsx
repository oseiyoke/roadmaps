'use client';

import React, { forwardRef } from 'react';
import { line, curveCatmullRom } from 'd3-shape';

interface RoadmapPathProps {
  points: { x: number; y: number }[];
  pathId?: string;
}

export const RoadmapPath = forwardRef<SVGPathElement, RoadmapPathProps>(
  ({ points, pathId = 'roadPath' }, ref) => {
    // generate a smooth Catmull–Rom spline through our control points
    const pathGenerator = line<{ x: number; y: number }>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(curveCatmullRom.alpha(0.7)); // Increased alpha for smoother curves
    const d = pathGenerator(points)!;

    return (
      <>
        {/* Define gradients and effects */}
        <defs>
          {/* Asphalt gradient with texture */}
          <linearGradient id="asphaltGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4a5568', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#2d3748', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1a202c', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Road surface pattern for texture */}
          <pattern id="roadTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#2d3748"/>
            <circle cx="2" cy="2" r="0.5" fill="#4a5568" opacity="0.3"/>
          </pattern>
          
          {/* Enhanced shadow filter */}
          <filter id="roadShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feFlood floodColor="#000000" floodOpacity="0.3"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Glow effect for road edges */}
          <filter id="edgeGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Road layers for depth */}
        <g filter="url(#roadShadow)">
          {/* Road base (wider for shoulders) */}
          <path
            d={d}
            className="fill-none stroke-gray-800 stroke-[50]"
            strokeLinecap="round"
            opacity="0.5"
          />
          
          {/* Road border (darker outline) */}
          <path
            ref={ref}
            id={pathId}
            d={d}
            className="fill-none stroke-[88]"
            stroke="url(#asphaltGradient)"
            strokeLinecap="round"
          />
          
          {/* Main road surface with texture */}
          <path
            d={d}
            className="fill-none stroke-[84]"
            stroke="#2d3748"
            strokeLinecap="round"
          />
          
          {/* Road surface texture overlay */}
          <path
            d={d}
            className="fill-none stroke-[80]"
            stroke="url(#roadTexture)"
            strokeLinecap="round"
            opacity="0.5"
          />
          
          {/* Road edge lines (white) - left side */}
          <path 
            d={d}
            className="fill-none stroke-white stroke-[1]"
            strokeLinecap="round"
            strokeDasharray="0"
            transform="translate(0,-38)"
            filter="url(#edgeGlow)"
          />
          
          <path 
            d={d}
            className="fill-none stroke-white stroke-[1]"
            strokeLinecap="round"
            strokeDasharray="0"
            transform="translate(0,38)"
            filter="url(#edgeGlow)"
          />
          
          {/* Road center line (dashed yellow) - double yellow for scenic road */}
          <path
            d={d}
            className="fill-none stroke-yellow-400 stroke-[2]"
            strokeLinecap="round"
            strokeDasharray="30 20"
            transform="translate(0,-2)"
            opacity="0.8"
          />
          <path
            d={d}
            className="fill-none stroke-yellow-400 stroke-[2]"
            strokeLinecap="round"
            strokeDasharray="30 20"
            transform="translate(0,2)"
            opacity="0.8"
          />
          
        </g>
      </>
    );
  }
);

RoadmapPath.displayName = 'RoadmapPath'; 