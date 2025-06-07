'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { RoadmapConfigContext } from './RoadmapViewer';

interface RoadmapHeaderProps {
  onRefresh?: () => void;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({ onRefresh }) => {
  // Try to get config from context
  let roadmapName = 'Roadmap';
  try {
    const config = useContext(RoadmapConfigContext);
    if (config) {
      roadmapName = config.name;
    }
  } catch {
    // Context not available, use default
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-sm">
      <div className="px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <Link
            href="/dashboard"
            className="group inline-flex items-center px-2.5 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Center - Roadmap name */}
          <h1 className="text-lg font-medium text-gray-800 tracking-tight">{roadmapName}</h1>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-md transition-all"
                title="Sync with Notion"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}; 