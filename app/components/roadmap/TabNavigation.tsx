'use client';

import React from 'react';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

type TabType = 'content' | 'tasks' | 'timeline';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  completedCount: number;
  totalTasks: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  completedCount,
  totalTasks
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="flex">
        <button
          onClick={() => onTabChange('content')}
          className={`
            flex-1 px-6 py-4 text-sm font-medium transition-all duration-200
            ${activeTab === 'content' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <DocumentTextIcon className="w-5 h-5" />
            Content
          </div>
        </button>
        <button
          onClick={() => onTabChange('tasks')}
          className={`
            flex-1 px-6 py-4 text-sm font-medium transition-all duration-200
            ${activeTab === 'tasks' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Tasks
            <span className={`
              px-2 py-0.5 text-xs rounded-full font-medium
              ${activeTab === 'tasks' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-200 text-slate-700'
              }
            `}>
              {completedCount}/{totalTasks}
            </span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('timeline')}
          className={`
            flex-1 px-6 py-4 text-sm font-medium transition-all duration-200
            ${activeTab === 'timeline' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <ClockIcon className="w-5 h-5" />
            Timeline
          </div>
        </button>
      </div>
    </div>
  );
}; 