'use client';

import React from 'react';
import { ContentBlock } from '@/app/types/roadmap';
import { HeadingBlock } from './HeadingBlock';
import { ParagraphBlock } from './ParagraphBlock';
import { ListItemBlock } from './ListItemBlock';
import { QuoteBlock } from './QuoteBlock';
import { CalloutBlock } from './CalloutBlock';
import { CodeBlock } from './CodeBlock';

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
  className?: string;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ 
  blocks, 
  className = '' 
}) => {
  // Debug logging
  React.useEffect(() => {
  }, [blocks]);

  // Group consecutive list items together
  const groupedBlocks = React.useMemo(() => {
    const result: (ContentBlock | ContentBlock[])[] = [];
    let currentListGroup: ContentBlock[] = [];
    let currentListType: 'bulleted_list_item' | 'numbered_list_item' | null = null;
    
    blocks.forEach((block) => {
      if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
        if (currentListType === block.type) {
          currentListGroup.push(block);
        } else {
          // Save previous list group if exists
          if (currentListGroup.length > 0) {
            result.push([...currentListGroup]);
          }
          // Start new list group
          currentListGroup = [block];
          currentListType = block.type;
        }
      } else {
        // Save current list group if exists
        if (currentListGroup.length > 0) {
          result.push([...currentListGroup]);
          currentListGroup = [];
          currentListType = null;
        }
        // Add non-list block
        result.push(block);
      }
    });
    
    // Don't forget the last list group
    if (currentListGroup.length > 0) {
      result.push(currentListGroup);
    }
    
    return result;
  }, [blocks]);
  
  return (
    <div className={`space-y-6 ${className}`}>
      {groupedBlocks.map((blockOrGroup, index) => {
        // If it's a list group
        if (Array.isArray(blockOrGroup)) {
          const isNumbered = blockOrGroup[0].type === 'numbered_list_item';
          return (
            <div key={`list-${index}`} className="space-y-2">
              {blockOrGroup.map((item, itemIndex) => (
                <ListItemBlock
                  key={item.id}
                  block={item}
                  index={isNumbered ? itemIndex + 1 : undefined}
                />
              ))}
            </div>
          );
        }
        
        // Single block
        const block = blockOrGroup;
        
        switch (block.type) {
          case 'heading_1':
          case 'heading_2':
          case 'heading_3':
            return <HeadingBlock key={block.id} block={block} />;
            
          case 'paragraph':
            return <ParagraphBlock key={block.id} block={block} />;
            
          case 'quote':
            return <QuoteBlock key={block.id} block={block} />;
            
          case 'callout':
            return <CalloutBlock key={block.id} block={block} />;
            
          case 'code':
            return <CodeBlock key={block.id} block={block} />;
            
          case 'divider':
            return (
              <hr
                key={block.id}
                className="border-t border-slate-200 my-8"
              />
            );
            
          // TODO: Add toggle support with nested content
          case 'toggle':
            return (
              <details key={block.id} className="group">
                <summary className="cursor-pointer py-2 px-3 rounded hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <span className="text-slate-500 transition-transform group-open:rotate-90">▶</span>
                  <span className="text-slate-700 font-medium">{block.text}</span>
                </summary>
                {block.children && block.children.length > 0 && (
                  <div className="pl-8 pt-2">
                    <ContentBlockRenderer blocks={block.children} />
                  </div>
                )}
              </details>
            );
            
          // Add more block types as needed
          default:
            return null;
        }
      })}
    </div>
  );
}; 