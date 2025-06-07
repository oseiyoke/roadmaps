'use client';

import React from 'react';
import { ContentBlock } from '@/app/types/roadmap';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

interface ListItemBlockProps {
  block: ContentBlock;
  index?: number; // For numbered lists
}

export const ListItemBlock: React.FC<ListItemBlockProps> = ({ block, index }) => {
  const isNumbered = block.type === 'numbered_list_item';
  
  return (
    <div className="flex items-start gap-3 group">
      {/* Bullet or Number */}
      <div className="flex-shrink-0 mt-0.5">
        {isNumbered && index ? (
          <span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
            {index}
          </span>
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-blue-500 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <p className="text-slate-700 leading-relaxed">
          {block.text}
        </p>
        
        {/* Render nested children if any */}
        {block.children && block.children.length > 0 && (
          <div className="mt-2 ml-4 space-y-2">
            {block.children.map((child, childIndex) => (
              <ListItemBlock
                key={child.id}
                block={child}
                index={child.type === 'numbered_list_item' ? childIndex + 1 : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 