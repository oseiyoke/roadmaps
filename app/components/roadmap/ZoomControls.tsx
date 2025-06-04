'use client';

import React from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="fixed bottom-8 right-8 flex gap-2 z-30">
      <button
        onClick={onZoomOut}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
        aria-label="Zoom out"
      >
        <MinusIcon className="w-5 h-5 text-gray-600" />
      </button>
      <button
        onClick={onZoomIn}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
        aria-label="Zoom in"
      >
        <PlusIcon className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}; 