'use client';

import React from 'react';
import { ContentBlock } from '@/app/types/roadmap';
import { 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface CalloutBlockProps {
  block: ContentBlock;
}

export const CalloutBlock: React.FC<CalloutBlockProps> = ({ block }) => {
  const { icon, color } = block.metadata || {};
  
  // Map Notion colors to Tailwind classes
  const colorClasses = {
    gray: 'bg-gray-50 border-gray-300 text-gray-800',
    brown: 'bg-amber-50 border-amber-300 text-amber-800',
    orange: 'bg-orange-50 border-orange-300 text-orange-800',
    yellow: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    green: 'bg-green-50 border-green-300 text-green-800',
    blue: 'bg-blue-50 border-blue-300 text-blue-800',
    purple: 'bg-purple-50 border-purple-300 text-purple-800',
    pink: 'bg-pink-50 border-pink-300 text-pink-800',
    red: 'bg-red-50 border-red-300 text-red-800',
  };
  
  const bgClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.gray;
  
  // Default icon if none provided
  const renderIcon = () => {
    if (icon) {
      return <span className="text-2xl">{icon}</span>;
    }
    
    // Default icons based on color
    switch (color) {
      case 'red':
        return <XCircleIcon className="w-6 h-6" />;
      case 'yellow':
        return <ExclamationTriangleIcon className="w-6 h-6" />;
      case 'green':
        return <CheckCircleIcon className="w-6 h-6" />;
      case 'blue':
        return <InformationCircleIcon className="w-6 h-6" />;
      default:
        return <LightBulbIcon className="w-6 h-6" />;
    }
  };
  
  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${bgClass}`}>
      <div className="flex-shrink-0 mt-0.5">
        {renderIcon()}
      </div>
      <div className="flex-1">
        <p className="leading-relaxed">
          {block.text}
        </p>
      </div>
    </div>
  );
}; 