import React from 'react';
import { CloudProps } from './types';
import { COLOR_PALETTE } from './constants';

/**
 * Cloud component that renders a simple, rounded cloud shape matching the image style with animation
 */
export const Cloud: React.FC<CloudProps> = ({ x, y, scale, opacity }) => {
  const baseSize = 100 * scale;
  const cloudColor = COLOR_PALETTE.clouds;
  
  // Generate unique animation duration and delay for each cloud
  const animationDuration = 20 + (Math.abs(x + y) % 40); // 20-60 seconds
  const animationDelay = Math.abs(x * y) % 10; // 0-10 seconds
  
  return (
    <>
      {/* Cloud animation styles */}
      <style jsx global>{`
        @keyframes cloudDrift {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(-15px) translateY(-5px); }
          50% { transform: translateX(-30px) translateY(0px); }
          75% { transform: translateX(-20px) translateY(5px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes cloudFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .cloud-drift {
          animation: cloudDrift ${animationDuration}s ease-in-out infinite;
          animation-delay: ${animationDelay}s;
        }
        .cloud-float {
          animation: cloudFloat 8s ease-in-out infinite;
          animation-delay: ${animationDelay * 0.5}s;
        }
      `}</style>
      
      <g 
        opacity={opacity} 
        className="cloud-drift cloud-float"
        style={{ transformOrigin: `${x}px ${y}px` }}
      >
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
    </>
  );
}; 