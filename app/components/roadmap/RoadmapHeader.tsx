'use client';

import React from 'react';

interface RoadmapHeaderProps {
  onRefresh?: () => void;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({ onRefresh }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4 text-center justify-center backdrop-blur-sm">
      <div className="flex items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Seamless</h1>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Refresh from Notion"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}; 