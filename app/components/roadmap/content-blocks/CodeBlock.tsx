'use client';

import React from 'react';
import { ContentBlock } from '@/app/types/roadmap';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CodeBlockProps {
  block: ContentBlock;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  const [copied, setCopied] = React.useState(false);
  const language = block.metadata?.language || 'plaintext';
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 bg-white/80 rounded border border-slate-200 cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs text-slate-400 font-mono">{language}</span>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-slate-100 font-mono leading-relaxed">
            {block.text}
          </code>
        </pre>
      </div>
    </div>
  );
}; 