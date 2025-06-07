'use client';

import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';
import { Milestone as MilestoneType } from '@/app/types/roadmap';

interface MiniMapProps {
  milestones: MilestoneType[];
  currentPosition?: { x: number; y: number } | null;
  onMilestoneClick?: (phase: number) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({ 
  milestones, 
  currentPosition,
  onMilestoneClick 
}) => {
  if (!milestones || milestones.length === 0) return null;

  // Calculate mini-map dimensions and scaling
  const mapWidth = 300;
  const mapHeight = 60;
  const padding = 20;
  
  // Find the bounds of the original roadmap
  const minX = Math.min(...milestones.map(m => m.x));
  const maxX = Math.max(...milestones.map(m => m.x));
  const minY = Math.min(...milestones.map(m => m.y));
  const maxY = Math.max(...milestones.map(m => m.y));
  
  // Scale factor to fit milestones in mini-map
  const scaleX = (mapWidth - padding * 2) / (maxX - minX);
  const scaleY = (mapHeight - padding * 2) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);
  
  // Convert coordinates to mini-map space
  const scaledMilestones = milestones.map(milestone => ({
    ...milestone,
    x: padding + (milestone.x - minX) * scale,
    y: padding + (milestone.y - minY) * scale,
  }));
  
  const scaledCurrentPosition = currentPosition ? {
    x: padding + (currentPosition.x - minX) * scale,
    y: padding + (currentPosition.y - minY) * scale,
  } : null;

  return (
    <div className="fixed bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
      <div className="text-xs font-medium text-gray-600 mb-2">Journey Progress</div>
      <svg width={mapWidth} height={mapHeight} className="rounded border border-gray-100">
        {/* Background */}
        <rect 
          width={mapWidth} 
          height={mapHeight} 
          fill="#f8fafc" 
          stroke="#e2e8f0" 
          strokeWidth="1"
        />
        
        {/* Road path - simplified as a line connecting milestones */}
        <path
          d={`M ${scaledMilestones.map(m => `${m.x},${m.y}`).join(' L ')}`}
          stroke="#94a3b8"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Completed path - line from start to current position */}
        {scaledCurrentPosition && (
          <path
            d={`M ${scaledMilestones[0]?.x || 0},${scaledMilestones[0]?.y || 0} L ${scaledCurrentPosition.x},${scaledCurrentPosition.y}`}
            stroke="#10b981"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        
        {/* Milestones */}
        {scaledMilestones.map((milestone) => (
          <g key={milestone.id}>
            {milestone.status === 'completed' ? (
              <g
                className="cursor-pointer"
                onClick={() => onMilestoneClick?.(milestone.phase)}
              >
                <circle
                  cx={milestone.x}
                  cy={milestone.y}
                  r="6"
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
                <foreignObject
                  x={milestone.x - 4}
                  y={milestone.y - 4}
                  width="8"
                  height="8"
                >
                  <TrophyIcon className="w-full h-full text-yellow-600" />
                </foreignObject>
              </g>
            ) : (
              <circle
                cx={milestone.x}
                cy={milestone.y}
                r="4"
                fill={milestone.status === 'in-progress' ? '#f97316' : '#e2e8f0'}
                stroke={milestone.status === 'in-progress' ? '#ea580c' : '#94a3b8'}
                strokeWidth="1"
                className="cursor-pointer"
                onClick={() => onMilestoneClick?.(milestone.phase)}
              />
            )}
          </g>
        ))}
        
        {/* Current position indicator */}
        {scaledCurrentPosition && (
          <g>
            <circle
              cx={scaledCurrentPosition.x}
              cy={scaledCurrentPosition.y}
              r="4"
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth="2"
            />
            <circle
              cx={scaledCurrentPosition.x}
              cy={scaledCurrentPosition.y}
              r="6"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
              opacity="0.5"
            >
              <animate 
                attributeName="r" 
                values="6;10;6" 
                dur="2s" 
                repeatCount="indefinite"
              />
              <animate 
                attributeName="opacity" 
                values="0.5;0;0.5" 
                dur="2s" 
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}; 