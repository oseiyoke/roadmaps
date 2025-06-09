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
        {/* Road layers for depth - simplified without heavy filters */}
        <g>
          {/* Road base (wider for shoulders) - simplified */}
          <path
            d={d}
            className="fill-none stroke-gray-800 stroke-[50]"
            strokeLinecap="round"
            opacity="0.5"
          />
          
          {/* Main road surface */}
          <path
            ref={ref}
            id={pathId}
            d={d}
            className="fill-none stroke-[84]"
            stroke="#2d3748"
            strokeLinecap="round"
          />
          
          {/* Subtle shadow underneath instead of filter */}
          <path
            d={d}
            className="fill-none stroke-black stroke-[86]"
            strokeLinecap="round"
            opacity="0.1"
            transform="translate(0, 2)"
          />
          
          {/* Road edge lines (white) - simplified */}
          <path 
            d={d}
            className="fill-none stroke-white stroke-[2]"
            strokeLinecap="round"
            transform="translate(0,-38)"
            opacity="0.9"
          />
          
          <path 
            d={d}
            className="fill-none stroke-white stroke-[2]"
            strokeLinecap="round"
            transform="translate(0,38)"
            opacity="0.9"
          />
          
          {/* Road center line - single dashed yellow line instead of double */}
          <path
            d={d}
            className="fill-none stroke-yellow-400 stroke-[3]"
            strokeLinecap="round"
            strokeDasharray="30 20"
            opacity="0.8"
          />
          
          {/* Static sparkles using <use> for better performance */}
          <g className="road-sparkles" opacity="0.6">
            {points
              .filter((_, i) => i % 3 === 0) // Reduce sparkle count
              .map((point, index) => (
                <use
                  key={index}
                  href="#sparkle-static"
                  x={point.x + (Math.random() - 0.5) * 40}
                  y={point.y + (Math.random() - 0.5) * 40}
                  transform={`scale(${0.5 + Math.random() * 0.5})`}
                />
              ))}
          </g>
        </g>
      </>
    );
  }
);

RoadmapPath.displayName = 'RoadmapPath'; 