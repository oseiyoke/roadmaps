'use client';

import React from 'react';
import { ContentBlock } from '@/app/types/roadmap';

interface QuoteBlockProps {
  block: ContentBlock;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({ block }) => {
  return (
    <blockquote className="relative pl-6 border-l-4 border-slate-300 italic">
      <div className="absolute left-0 top-0 -ml-1 text-4xl text-slate-300 font-serif">&ldquo;</div>
      <p className="text-slate-600 leading-relaxed">
        {block.text}
      </p>
    </blockquote>
  );
}; 