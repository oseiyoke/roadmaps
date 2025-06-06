'use client';

import React, { useMemo } from 'react';
import {
  CloudLayer,
  Hill,
  SVGDefs,
  generateClouds,
  generateHillLayers,
  generateTreesOnHills,
  LANDSCAPE_DIMENSIONS,
  LandscapeBackgroundProps
} from './landscape';

/**
 * LandscapeBackground component
 * 
 * Renders a stylized landscape with layered hills, trees, and clouds.
 * Uses internal coordinate system for consistent scaling across different viewport sizes.
 * 
 * @param width - Viewport width
 * @param height - Viewport height
 */
export const LandscapeBackground: React.FC<LandscapeBackgroundProps> = ({ width, height }) => {
  const { width: internalWidth, height: internalHeight } = LANDSCAPE_DIMENSIONS;
  
  // Generate static data with memoization to prevent unnecessary re-renders
  const hillLayers = useMemo(() => generateHillLayers(), []);
  const trees = useMemo(() => generateTreesOnHills(hillLayers), [hillLayers]);
  const clouds = useMemo(() => generateClouds(), []);

  return (
    <svg
      className="landscape-background absolute inset-0 w-full h-full"
      width={width}
      height={height}
      viewBox={`0 0 ${internalWidth} ${internalHeight}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      {/* SVG definitions for gradients and filters */}
      <SVGDefs />

      {/* Sky gradient background */}
      <rect
        width={internalWidth}
        height={internalHeight}
        fill="url(#skyGradient)"
        opacity="0.8"
      />

      {/* Cloud layers rendered in order for proper depth */}
      <CloudLayer clouds={clouds} layer="far" applyBlur />
      <CloudLayer clouds={clouds} layer="mid" />

      {/* Render hill layers with proper z-ordering */}
      {hillLayers.map((layer, index) => (
        <React.Fragment key={layer.id}>
          {/* Render the hill with its trees */}
          <Hill layer={layer} trees={trees} />
          
          {/* Render near clouds after far hills for proper layering */}
          {index === 0 && <CloudLayer clouds={clouds} layer="near" />}
        </React.Fragment>
      ))}

      {/* Atmospheric overlay for depth and lighting */}
      <rect
        width={internalWidth}
        height={internalHeight}
        fill="url(#atmosphereGradient)"
        opacity="0.7"
      />
    </svg>
  );
}; 
 