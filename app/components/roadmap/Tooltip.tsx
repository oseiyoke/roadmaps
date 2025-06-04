'use client';

import React from 'react';

interface TooltipProps {
  show: boolean;
  title: string;
  tagline: string;
  position: { x: number; y: number };
}

export const Tooltip: React.FC<TooltipProps> = ({ show, title, tagline, position }) => {
  if (!show) return null;

  return (
    <div 
      className={`
        absolute bg-white border border-gray-200 rounded-lg p-3 shadow-lg
        pointer-events-none z-50 transition-all duration-200
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <h4 className="text-sm font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-xs text-gray-600">{tagline}</p>
    </div>
  );
}; 