'use client';

import React from 'react';

interface VehicleProps {
  x: number;
  y: number;
}

export const Vehicle: React.FC<VehicleProps> = ({ x, y }) => {
  return (
    <>
      {/* Vehicle animations */}
      <style jsx global>{`
        @keyframes vehicleBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes wheelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes exhaustPuff {
          0% { opacity: 0.8; transform: scale(0.5) translateX(0px); }
          100% { opacity: 0; transform: scale(1.5) translateX(-15px); }
        }
        .vehicle-bob {
          animation: vehicleBob 2s ease-in-out infinite;
        }
        .wheel-spin {
          animation: wheelSpin 1s linear infinite;
        }
        .exhaust-puff {
          animation: exhaustPuff 1.5s ease-out infinite;
        }
        .exhaust-puff:nth-child(2) {
          animation-delay: 0.5s;
        }
        .exhaust-puff:nth-child(3) {
          animation-delay: 1s;
        }
      `}</style>
      
      <g className="vehicle-marker">
        {/* Vehicle shadow */}
        <ellipse 
          cx={x} 
          cy={y + 12} 
          rx="18" 
          ry="4" 
          className="fill-black opacity-20"
        />
        
        {/* Exhaust puffs */}
        <g className="exhaust-effects">
          <circle 
            cx={x - 25} 
            cy={y + 2} 
            r="3" 
            className="fill-gray-400 opacity-60 exhaust-puff"
          />
          <circle 
            cx={x - 22} 
            cy={y + 1} 
            r="2" 
            className="fill-gray-300 opacity-50 exhaust-puff"
          />
          <circle 
            cx={x - 28} 
            cy={y + 3} 
            r="2.5" 
            className="fill-gray-500 opacity-40 exhaust-puff"
          />
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
        
        {/* Wheels (spinning) */}
        <g className="wheel-spin" style={{ transformOrigin: `${x - 10}px ${y + 6}px` }}>
          <circle
            cx={x - 10}
            cy={y + 6}
            r="4"
            className="fill-gray-800 stroke-gray-900 stroke-1"
          />
          <circle
            cx={x - 10}
            cy={y + 6}
            r="2"
            className="fill-gray-600"
          />
          <rect
            x={x - 11}
            y={y + 4}
            width="2"
            height="4"
            className="fill-gray-400"
          />
        </g>
        
        <g className="wheel-spin" style={{ transformOrigin: `${x + 10}px ${y + 6}px` }}>
          <circle
            cx={x + 10}
            cy={y + 6}
            r="4"
            className="fill-gray-800 stroke-gray-900 stroke-1"
          />
          <circle
            cx={x + 10}
            cy={y + 6}
            r="2"
            className="fill-gray-600"
          />
          <rect
            x={x + 9}
            y={y + 4}
            width="2"
            height="4"
            className="fill-gray-400"
          />
        </g>
      </g>
    </>
  );
}; 