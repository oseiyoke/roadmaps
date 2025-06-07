'use client';

import React from 'react';

interface HumanProps {
  x: number;
  y: number;
}

export const Human: React.FC<HumanProps> = ({ x, y }) => {
  return (
    <>
      {/* Human animations */}
      <style jsx global>{`
        @keyframes humanWalk {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes armSwing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes legStep {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        .human-walk {
          animation: humanWalk 1.5s ease-in-out infinite;
        }
        .arm-swing {
          animation: armSwing 1.5s ease-in-out infinite;
        }
        .leg-step {
          animation: legStep 1.5s ease-in-out infinite;
        }
        .leg-step-alt {
          animation: legStep 1.5s ease-in-out infinite reverse;
        }
      `}</style>
      
      <g className="human-marker">
        {/* Human shadow */}
        <ellipse 
          cx={x} 
          cy={y + 15} 
          rx="12" 
          ry="3" 
          className="fill-black opacity-20"
        />
        
        {/* Main human body with walk animation */}
        <g className="human-walk" style={{ transformOrigin: `${x}px ${y}px` }}>
          {/* Head */}
          <circle
            cx={x}
            cy={y - 20}
            r="5"
            className="fill-amber-200 stroke-amber-300 stroke-1"
          />
          
          {/* Face details */}
          <circle cx={x - 1.5} cy={y - 21} r="0.5" className="fill-black" />
          <circle cx={x + 1.5} cy={y - 21} r="0.5" className="fill-black" />
          <path 
            d={`M ${x - 1} ${y - 18} Q ${x} ${y - 17} ${x + 1} ${y - 18}`}
            className="stroke-black stroke-[0.5] fill-none"
          />
          
          {/* Hair */}
          <path
            d={`M ${x - 4} ${y - 23} Q ${x} ${y - 25} ${x + 4} ${y - 23} Q ${x + 3} ${y - 21} ${x - 3} ${y - 21} Z`}
            className="fill-amber-800"
          />
          
          {/* Body (torso) */}
          <rect
            x={x - 4}
            y={y - 14}
            width="8"
            height="12"
            rx="2"
            className="fill-blue-500 stroke-blue-600 stroke-1"
          />
          
          {/* Arms with swing animation */}
          <g className="arm-swing" style={{ transformOrigin: `${x - 3}px ${y - 10}px` }}>
            <rect
              x={x - 4}
              y={y - 12}
              width="2"
              height="8"
              rx="1"
              className="fill-amber-200 stroke-amber-300 stroke-[0.5]"
            />
          </g>
          
          <g className="arm-swing" style={{ transformOrigin: `${x + 3}px ${y - 10}px`, animationDelay: '0.75s' }}>
            <rect
              x={x + 2}
              y={y - 12}
              width="2"
              height="8"
              rx="1"
              className="fill-amber-200 stroke-amber-300 stroke-[0.5]"
            />
          </g>
          
          {/* Legs with stepping animation */}
          <g className="leg-step" style={{ transformOrigin: `${x - 2}px ${y - 2}px` }}>
            <rect
              x={x - 3}
              y={y - 2}
              width="2"
              height="10"
              rx="1"
              className="fill-blue-700 stroke-blue-800 stroke-[0.5]"
            />
          </g>
          
          <g className="leg-step-alt" style={{ transformOrigin: `${x + 2}px ${y - 2}px` }}>
            <rect
              x={x + 1}
              y={y - 2}
              width="2"
              height="10"
              rx="1"
              className="fill-blue-700 stroke-blue-800 stroke-[0.5]"
            />
          </g>
          
          {/* Feet */}
          <ellipse
            cx={x - 2}
            cy={y + 9}
            rx="2"
            ry="1"
            className="fill-black"
          />
          <ellipse
            cx={x + 2}
            cy={y + 9}
            rx="2"
            ry="1"
            className="fill-black"
          />
          
          {/* Backpack (to show journey/progress) */}
          <rect
            x={x - 2}
            y={y - 13}
            width="4"
            height="6"
            rx="1"
            className="fill-green-600 stroke-green-700 stroke-[0.5]"
          />
          
          {/* Backpack straps */}
          <rect
            x={x - 3}
            y={y - 11}
            width="1"
            height="4"
            className="fill-green-700"
          />
          <rect
            x={x + 2}
            y={y - 11}
            width="1"
            height="4"
            className="fill-green-700"
          />
        </g>
      </g>
    </>
  );
}; 