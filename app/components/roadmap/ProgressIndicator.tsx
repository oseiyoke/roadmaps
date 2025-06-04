'use client';

import React from 'react';

interface ProgressIndicatorProps {
  progress: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-full shadow-lg flex items-center gap-4 z-30">
      <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-800">{progress}%</span>
    </div>
  );
}; 