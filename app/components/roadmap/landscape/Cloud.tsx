import React from 'react';
import { CloudProps } from './types';
import { COLOR_PALETTE } from './constants';

/**
 * Cloud component that renders a simple, rounded cloud shape matching the image style
 */
export const Cloud: React.FC<CloudProps> = ({ x, y, scale, opacity }) => {
  const baseSize = 100 * scale;
  const cloudColor = COLOR_PALETTE.clouds;
  
  return (
    <g opacity={opacity}>
      {/* Main cloud body - larger center circle */}
      <circle 
        cx={x} 
        cy={y} 
        r={baseSize * 0.5} 
        fill={cloudColor} 
      />
      
      {/* Left puff */}
      <circle 
        cx={x - baseSize * 0.35} 
        cy={y + baseSize * 0.1} 
        r={baseSize * 0.35} 
        fill={cloudColor} 
      />
      
      {/* Right puff */}
      <circle 
        cx={x + baseSize * 0.35} 
        cy={y + baseSize * 0.05} 
        r={baseSize * 0.4} 
        fill={cloudColor} 
      />
      
      {/* Top left puff */}
      <circle 
        cx={x - baseSize * 0.2} 
        cy={y - baseSize * 0.3} 
        r={baseSize * 0.3} 
        fill={cloudColor} 
      />
      
      {/* Top right puff */}
      <circle 
        cx={x + baseSize * 0.15} 
        cy={y - baseSize * 0.35} 
        r={baseSize * 0.25} 
        fill={cloudColor} 
      />
    </g>
  );
}; 