'use client';

import React from 'react';
import { PhaseData } from '@/app/types/roadmap';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface TaskListProps {
  phaseData: PhaseData;
}

export const TaskList: React.FC<TaskListProps> = ({ phaseData }) => {
  
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleSolid className="w-5 h-5 text-emerald-500" />;
      case 'in-progress':
        return <div className="w-5 h-5 border-2 border-amber-500 rounded-full bg-amber-100 relative">
          <div className="absolute inset-1 bg-amber-500 rounded-full opacity-60"></div>
        </div>;
      default:
        return <div className="w-5 h-5 border-2 border-slate-300 rounded-full bg-white"></div>;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Phase Tasks
        </h3>
      </div>

      {/* Task List - Read Only */}
      <div className="space-y-2">
        {phaseData.tasks
          .slice()  // Create a copy to avoid mutating original array
          .sort((a, b) => {
            // Sort priority: completed -> in-progress -> pending
            const statusOrder = { 'completed': 0, 'in-progress': 1, 'pending': 2 };
            return statusOrder[a.status] - statusOrder[b.status];
          })
          .map((task, index) => (
          <div
            key={index}
            className={`
              relative p-3 rounded-lg border transition-all duration-200 hover:shadow-sm
              ${task.status === 'completed' 
                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
                : task.status === 'in-progress'
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                : 'bg-white border-slate-200'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Status Icon - Read Only */}
              <div className="flex-shrink-0">
                {getTaskStatusIcon(task.status)}
              </div>
              
              {/* Task Name - Read Only */}
              <span 
                className={`
                  flex-1 text-slate-900 leading-relaxed
                  ${task.status === 'completed' ? 'line-through opacity-75' : ''}
                `}
              >
                {task.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {phaseData.tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleSolid className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-lg font-medium mb-2">No tasks yet</p>
          <p className="text-slate-400 text-sm">Tasks will appear here when added to this phase</p>
        </div>
      )}
    </div>
  );
}; 