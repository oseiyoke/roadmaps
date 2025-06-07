'use client';

import React from 'react';
import { ContentBlock } from '@/app/types/roadmap';

interface ParagraphBlockProps {
  block: ContentBlock;
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ block }) => {
  if (!block.text.trim()) return null;
  
  return (
    <p className="text-slate-700 leading-relaxed">
      {block.text}
    </p>
  );
}; 