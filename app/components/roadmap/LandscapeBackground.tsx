'use client';

import React, { useMemo } from 'react';

interface LandscapeBackgroundProps {
  width: number;
  height: number;
}

export const LandscapeBackground: React.FC<LandscapeBackgroundProps> = ({ width, height }) => {
  // Helper function to interpolate Y position on a hill curve
  const getYPositionOnHill = (
    xPos: number,
    points: { x: number; y: number }[],
    baseY: number,
    amplitude: number
  ): number => {
    // Find the two points that xPos falls between
    let leftPoint = points[0];
    let rightPoint = points[1];
    
    for (let i = 0; i < points.length - 1; i++) {
      if (xPos >= points[i].x && xPos <= points[i + 1].x) {
        leftPoint = points[i];
        rightPoint = points[i + 1];
        break;
      } else if (xPos > points[points.length - 1].x) {
        // Beyond the last point, use the last two points
        leftPoint = points[points.length - 2];
        rightPoint = points[points.length - 1];
      }
    }
    
    // Linear interpolation between the two points
    const t = (xPos - leftPoint.x) / (rightPoint.x - leftPoint.x);
    const interpolatedY = leftPoint.y + (rightPoint.y - leftPoint.y) * t;
    
    return baseY + interpolatedY * amplitude;
  };

  // Generate smooth curve paths for hills
  const generateHillPath = (
    points: { x: number; y: number }[],
    baseY: number,
    amplitude: number
  ): string => {
    let path = `M 0,${height}`;
    
    points.forEach((point, i) => {
      if (i === 0) {
        path += ` L 0,${baseY + point.y * amplitude}`;
      }
      
      // Use quadratic bezier curves for smooth hills
      if (i > 0 && i < points.length) {
        const prevPoint = points[i - 1];
        const cpX = (prevPoint.x + point.x) / 2;
        const cpY = baseY + ((prevPoint.y + point.y) / 2) * amplitude;
        path += ` Q ${cpX},${cpY} ${point.x},${baseY + point.y * amplitude}`;
      }
    });
    
    path += ` L ${width},${height} Z`;
    return path;
  };

  // Define hill layers with different characteristics
  const hillLayers = [
    {
      // Far background hills
      id: 'far-hills',
      className: 'landscape-layer-far',
      points: [
        { x: 0, y: 0.3 },
        { x: 400, y: 0.2 },
        { x: 800, y: 0.4 },
        { x: 1200, y: 0.15 },
        { x: 1600, y: 0.35 },
        { x: 2000, y: 0.25 },
        { x: 2400, y: 0.45 },
        { x: 2800, y: 0.2 },
        { x: 3200, y: 0.3 },
        { x: 3600, y: 0.25 },
        { x: width, y: 0.35 }
      ],
      baseY: height * 0.15,
      amplitude: 150,
      fill: 'url(#farHillGradient)',
      opacity: 0.75
    },
    {
      // Mid-distance hills
      id: 'mid-hills',
      className: 'landscape-layer-mid',
      points: [
        { x: 0, y: 0.25 },
        { x: 300, y: 0.15 },
        { x: 600, y: 0.35 },
        { x: 1000, y: 0.1 },
        { x: 1400, y: 0.4 },
        { x: 1800, y: 0.2 },
        { x: 2200, y: 0.3 },
        { x: 2600, y: 0.15 },
        { x: 3000, y: 0.35 },
        { x: 3400, y: 0.2 },
        { x: width, y: 0.3 }
      ],
      baseY: height * 0.35,
      amplitude: 120,
      fill: 'url(#midHillGradient)',
      opacity: 0.8
    },
    {
      // Near hills
      id: 'near-hills',
      className: 'landscape-layer-near',
      points: [
        { x: 0, y: 0.2 },
        { x: 500, y: 0.3 },
        { x: 900, y: 0.1 },
        { x: 1300, y: 0.35 },
        { x: 1700, y: 0.15 },
        { x: 2100, y: 0.25 },
        { x: 2500, y: 0.1 },
        { x: 2900, y: 0.3 },
        { x: 3300, y: 0.15 },
        { x: width, y: 0.25 }
      ],
      baseY: height * 0.6,
      amplitude: 100,
      fill: 'url(#nearHillGradient)',
      opacity: 0.85
    }
  ];

  // Generate trees positioned on actual hill curves
  const generateTreesOnHills = () => {
    const trees: { 
      x: number; 
      y: number; 
      size: number; 
      type: number; 
      opacity: number;
      layer: 'far' | 'mid' | 'near';
    }[] = [];
    
    // Generate trees for each hill layer
    hillLayers.forEach((layer, layerIndex) => {
      const treeCount = Math.ceil(width / (100 + layerIndex * 50)); // Fewer trees on farther hills
      
      for (let i = 0; i < treeCount; i++) {
        const baseX = (i / treeCount) * width;
        const x = baseX + (Math.random() - 0.5) * 100; // Add some randomness
        
        // Calculate Y position on the actual hill curve
        const hillY = getYPositionOnHill(x, layer.points, layer.baseY, layer.amplitude);
        
        // Place tree slightly above the hill surface (trees grow upward)
        const y = hillY - 5;
        
        // Size varies by layer - smaller trees farther away
        const baseSize = layerIndex === 0 ? 15 : layerIndex === 1 ? 20 : 25;
        const size = baseSize + Math.random() * 15;
        
        const type = Math.floor(Math.random() * 3);
        const opacity = 0.3 + Math.random() * 0.4;
        
        trees.push({ 
          x, 
          y, 
          size, 
          type, 
          opacity,
          layer: layerIndex === 0 ? 'far' : layerIndex === 1 ? 'mid' : 'near'
        });
      }
    });
    
    return trees;
  };

  // memoize so we don't regenerate on every render
  const trees = useMemo(() => generateTreesOnHills(), [width, height]);

  // Abstract tree component
  const AbstractTree: React.FC<{ x: number; y: number; size: number; type: number; opacity: number }> = ({ x, y, size, type, opacity }) => {
    switch (type) {
      case 0: // Coniferous tree
        return (
          <g opacity={opacity}>
            {/* Tree trunk */}
            <rect x={x - 2} y={y} width="4" height={size * 0.4} fill="#8B4513" />
            {/* Tree layers */}
            <polygon 
              points={`${x},${y - size * 0.3} ${x - size * 0.4},${y} ${x + size * 0.4},${y}`}
              fill="#22c55e"
            />
            <polygon 
              points={`${x},${y - size * 0.6} ${x - size * 0.3},${y - size * 0.2} ${x + size * 0.3},${y - size * 0.2}`}
              fill="#16a34a"
            />
            <polygon 
              points={`${x},${y - size} ${x - size * 0.2},${y - size * 0.4} ${x + size * 0.2},${y - size * 0.4}`}
              fill="#15803d"
            />
          </g>
        );
      case 1: // Round tree
        return (
          <g opacity={opacity}>
            {/* Tree trunk */}
            <rect x={x - 3} y={y} width="6" height={size * 0.5} fill="#92400e" />
            {/* Tree canopy */}
            <circle cx={x} cy={y - size * 0.3} r={size * 0.5} fill="#22c55e" />
            <circle cx={x - size * 0.2} cy={y - size * 0.2} r={size * 0.3} fill="#16a34a" />
            <circle cx={x + size * 0.15} cy={y - size * 0.25} r={size * 0.25} fill="#15803d" />
          </g>
        );
      case 2: // Abstract tree
        return (
          <g opacity={opacity}>
            {/* Tree trunk */}
            <rect x={x - 2.5} y={y} width="5" height={size * 0.4} fill="#a16207" />
            {/* Abstract canopy */}
            <ellipse cx={x} cy={y - size * 0.4} rx={size * 0.4} ry={size * 0.6} fill="#22c55e" />
            <ellipse cx={x - size * 0.1} cy={y - size * 0.5} rx={size * 0.25} ry={size * 0.35} fill="#16a34a" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      className="landscape-background absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Gradient definitions for each layer */}
        <linearGradient id="farHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.1" />
        </linearGradient>
        
        <linearGradient id="midHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.15" />
        </linearGradient>
        
        <linearGradient id="nearHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#cffafe" stopOpacity="0.2" />
        </linearGradient>

        {/* Atmospheric overlay gradient */}
        <radialGradient id="atmosphereGradient" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>

        {/* Mist effect */}
        <filter id="mistBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>

        {/* Tree blur for distance effect */}
        <filter id="treeBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Sky gradient background */}
      <rect
        width={width}
        height={height}
        fill="url(#skyGradient)"
        opacity="0.1"
      />
      
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="50%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fef9c3" />
      </linearGradient>

      {/* Render hill layers and their associated trees together */}
      {hillLayers.map((layer, layerIndex) => (
        <g key={layer.id} className={layer.className}>
          {/* Hill path */}
          <path
            d={generateHillPath(layer.points, layer.baseY, layer.amplitude)}
            fill={layer.fill}
            opacity={layer.opacity}
            filter="url(#mistBlur)"
          />
          
          {/* Trees for this hill layer */}
          <g filter={layerIndex === 0 ? "url(#treeBlur)" : undefined}>
            {trees
              .filter(tree => tree.layer === (layerIndex === 0 ? 'far' : layerIndex === 1 ? 'mid' : 'near'))
              .map((tree, index) => (
                <AbstractTree
                  key={`${layer.id}-tree-${index}`}
                  x={tree.x}
                  y={tree.y}
                  size={tree.size}
                  type={tree.type}
                  opacity={tree.opacity * layer.opacity}
                />
              ))}
          </g>
        </g>
      ))}

      {/* Atmospheric overlay */}
      <rect
        width={width}
        height={height}
        fill="url(#atmosphereGradient)"
        opacity="0.5"
      />

      {/* Additional decorative elements */}
      <g className="landscape-details" opacity="0.1">
        {/* Small cloud shapes */}
        <ellipse cx="600" cy="150" rx="80" ry="30" fill="white" opacity="0.3" />
        <ellipse cx="1400" cy="200" rx="100" ry="35" fill="white" opacity="0.25" />
        <ellipse cx="2200" cy="180" rx="90" ry="32" fill="white" opacity="0.28" />
        <ellipse cx="3000" cy="160" rx="85" ry="30" fill="white" opacity="0.3" />
      </g>
    </svg>
  );
}; 
 