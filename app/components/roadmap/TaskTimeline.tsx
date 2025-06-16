'use client';

import React from 'react';
import { PhaseData } from '@/app/types/roadmap';
import { 
  CheckCircleIcon as CheckCircleSolid,
  ClockIcon,
  PlayIcon
} from '@heroicons/react/24/solid';
import { 
  ClockIcon as ClockOutline,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface TaskTimelineProps {
  phaseData: PhaseData;
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ phaseData }) => {
  
  // Utility function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Utility function to get date range display
  const getDateRange = (startDate?: string, endDate?: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    
    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `Started ${start}`;
    } else if (end) {
      return `Due ${end}`;
    }
    return null;
  };

  // Utility function to check if task is overdue
  const isOverdue = (status: string, endDate?: string) => {
    if (!endDate || status === 'completed') return false;
    try {
      const end = new Date(endDate);
      const now = new Date();
      return end < now;
    } catch {
      return false;
    }
  };
  
  const getTaskStatusIcon = (status: string, index: number, totalTasks: number) => {
    const isLast = index === totalTasks - 1;
    
    switch (status) {
      case 'completed':
        return (
          <div className="relative">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircleSolid className="w-5 h-5 text-white" />
            </div>
            {!isLast && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-emerald-300"></div>
            )}
          </div>
        );
      case 'in-progress':
        return (
          <div className="relative">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <PlayIcon className="w-4 h-4 text-white ml-0.5" />
            </div>
            {!isLast && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-amber-300 to-slate-200"></div>
            )}
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center border-2 border-slate-300">
              <ClockOutline className="w-4 h-4 text-slate-500" />
            </div>
            {!isLast && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-slate-200"></div>
            )}
          </div>
        );
    }
  };

  const getTaskCardStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-emerald-100';
      case 'in-progress':
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-amber-100';
      default:
        return 'bg-white border-slate-200 shadow-slate-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <CheckCircleSolid className="w-3 h-3" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <ClockIcon className="w-3 h-3" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <ClockOutline className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  // Sort tasks by status priority for timeline flow
  const sortedTasks = phaseData.tasks
    .slice()
    .sort((a, b) => {
      const statusOrder = { 'completed': 0, 'in-progress': 1, 'pending': 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

  // Calculate progress
  const completedCount = phaseData.tasks.filter(task => task.status === 'completed').length;
  const inProgressCount = phaseData.tasks.filter(task => task.status === 'in-progress').length;
  const totalTasks = phaseData.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Task Progress</h3>
          <span className="text-2xl font-bold text-slate-700">{Math.round(progressPercentage)}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 font-medium">{completedCount} completed</span>
            <span className="text-amber-600 font-medium">{inProgressCount} in progress</span>
            <span className="text-slate-500">{totalTasks - completedCount - inProgressCount} pending</span>
          </div>
          <span className="text-slate-600">{totalTasks} total tasks</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Task Timeline</h3>
        
        {sortedTasks.length > 0 ? (
          <div className="space-y-0">
            {sortedTasks.map((task, index) => (
              <div key={index} className="flex items-start gap-4 group">
                {/* Timeline Icon */}
                <div className="flex-shrink-0 pt-2">
                  {getTaskStatusIcon(task.status, index, sortedTasks.length)}
                </div>
                
                                 {/* Task Card */}
                 <div className={`
                   flex-1 p-4 rounded-xl border transition-all duration-200 
                   group-hover:shadow-md group-hover:scale-[1.01] mb-4
                   ${getTaskCardStyle(task.status)}
                   ${isOverdue(task.status, task.endDate) ? 'ring-2 ring-red-200 bg-red-50' : ''}
                 `}>
                   <div className="flex items-start justify-between gap-3">
                     <div className="flex-1">
                       <h4 className={`
                         font-medium text-slate-900 leading-relaxed mb-2
                         ${task.status === 'completed' ? 'line-through opacity-75' : ''}
                       `}>
                         {task.name}
                       </h4>
                       
                       {/* Date Range */}
                       {getDateRange(task.startDate, task.endDate) && (
                         <div className="flex items-center gap-1 mb-2 text-sm text-slate-600">
                           <CalendarDaysIcon className="w-4 h-4" />
                           <span className={isOverdue(task.status, task.endDate) ? 'text-red-600 font-medium' : ''}>
                             {getDateRange(task.startDate, task.endDate)}
                             {isOverdue(task.status, task.endDate) && (
                               <span className="ml-1 text-red-500 font-semibold">(Overdue)</span>
                             )}
                           </span>
                         </div>
                       )}
                       
                       <div className="flex items-center justify-between">
                         {getStatusBadge(task.status)}
                         {isOverdue(task.status, task.endDate) && (
                           <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full">
                             Overdue
                           </span>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockOutline className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium mb-2">No tasks yet</p>
            <p className="text-slate-400 text-sm">Tasks will appear here when added to this phase</p>
          </div>
        )}
      </div>
    </div>
  );
}; 