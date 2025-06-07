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
 * Now designed to scroll with the roadmap for a seamless experience.
 * 
 * @param width - Scroll container width (extends beyond viewport)
 * @param height - Viewport height
 */
export const LandscapeBackground: React.FC<LandscapeBackgroundProps> = ({ width, height }) => {
  // Use the full scroll width for landscape generation to avoid repetition
  const landscapeWidth = Math.max(width, 5000); // Ensure minimum width for smooth scrolling
  const { height: internalHeight } = LANDSCAPE_DIMENSIONS;
  
  // Generate landscape data using the extended width for seamless scrolling
  const hillLayers = useMemo(() => {
    return generateHillLayers(landscapeWidth);
  }, [landscapeWidth]);
  
  const trees = useMemo(() => generateTreesOnHills(hillLayers, landscapeWidth), [hillLayers, landscapeWidth]);
  const clouds = useMemo(() => generateClouds(landscapeWidth), [landscapeWidth]);

  return (
    <svg
      className="landscape-background absolute inset-0 w-full h-full"
      width={width}
      height={height}
      viewBox={`0 0 ${landscapeWidth} ${internalHeight}`}
      preserveAspectRatio="xMinYMid slice"
      style={{ width: '100%', height: '100%' }}
    >
      {/* SVG definitions for gradients and filters */}
      <SVGDefs />

      {/* Sky gradient background */}
      <rect
        width={landscapeWidth}
        height={internalHeight}
        fill="url(#skyGradient)"
        opacity="0.3"
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
        width={landscapeWidth}
        height={internalHeight}
        fill="url(#atmosphereGradient)"
        opacity="0.2"
      />
    </svg>
  );
}; 
 