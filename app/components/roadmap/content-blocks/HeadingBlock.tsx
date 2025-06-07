'use client';

import React from 'react';
import { ContentBlock } from '@/app/types/roadmap';

interface HeadingBlockProps {
  block: ContentBlock;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
  const baseClasses = 'font-semibold text-slate-900';
  
  switch (block.type) {
    case 'heading_1':
      return (
        <h1 className={`${baseClasses} text-2xl mt-8 mb-4 first:mt-0`}>
          {block.text}
        </h1>
      );
      
    case 'heading_2':
      return (
        <h2 className={`${baseClasses} text-xl mt-6 mb-3 first:mt-0`}>
          {block.text}
        </h2>
      );
      
    case 'heading_3':
      return (
        <h3 className={`${baseClasses} text-lg mt-4 mb-2 first:mt-0`}>
          {block.text}
        </h3>
      );
      
    default:
      return null;
  }
}; 