'use client';

import React from 'react';

interface VehicleProps {
  x: number;
  y: number;
}

export const Vehicle: React.FC<VehicleProps> = ({ x, y }) => {
  return (
    <>
      {/* Simplified vehicle animations */}
      <style jsx global>{`
        @keyframes vehicleBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        .vehicle-bob {
          animation: vehicleBob 2s ease-in-out infinite;
        }
      `}</style>
      
      <g className="vehicle-marker">
        {/* Vehicle shadow using gradient */}
        <ellipse 
          cx={x} 
          cy={y + 12} 
          rx="18" 
          ry="4" 
          fill="url(#shadow-gradient)"
          opacity="0.3"
        />
        
        {/* Simplified exhaust puffs - static instead of animated */}
        <g className="exhaust-effects" opacity="0.4">
          <circle cx={x - 25} cy={y + 2} r="3" className="fill-gray-400" />
          <circle cx={x - 22} cy={y + 1} r="2" className="fill-gray-300" opacity="0.7" />
          <circle cx={x - 28} cy={y + 3} r="2.5" className="fill-gray-500" opacity="0.5" />
        </g>
        
        {/* Main vehicle body with bounce animation */}
        <g className="vehicle-bob" style={{ transformOrigin: `${x}px ${y}px` }}>
          {/* Car body */}
          <rect
            x={x - 20}
            y={y - 5}
            width="40"
            height="10"
            rx="5"
            className="fill-blue-500 stroke-blue-600 stroke-1"
          />
          
          {/* Car roof */}
          <rect
            x={x - 12}
            y={y - 12}
            width="24"
            height="8"
            rx="4"
            className="fill-blue-600"
          />
          
          {/* Windshield */}
          <rect
            x={x - 10}
            y={y - 11}
            width="20"
            height="6"
            rx="2"
            className="fill-cyan-200 opacity-80"
          />
          
          {/* Front bumper */}
          <rect
            x={x + 18}
            y={y - 2}
            width="4"
            height="4"
            rx="2"
            className="fill-gray-300"
          />
          
          {/* Headlights */}
          <circle
            cx={x + 20}
            cy={y - 3}
            r="1.5"
            className="fill-yellow-300"
          />
          <circle
            cx={x + 20}
            cy={y + 1}
            r="1.5"
            className="fill-yellow-300"
          />
          
          {/* Side details */}
          <rect
            x={x - 8}
            y={y - 3}
            width="16"
            height="1"
            className="fill-blue-400"
          />
        </g>
        
        {/* Wheels using reusable shapes */}
        <use
          href="#vehicle-wheel"
          x={x - 10}
          y={y + 6}
        />
        
        <use
          href="#vehicle-wheel"
          x={x + 10}
          y={y + 6}
        />
      </g>
    </>
  );
}; 