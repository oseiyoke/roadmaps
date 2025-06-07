'use client';

import React, { useRef, useEffect } from 'react';
import { PhaseData } from '@/app/types/roadmap';
import {
  XMarkIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon as CancelIcon,
  TrophyIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolid,
  BoltIcon as BoltSolid
} from '@heroicons/react/24/solid';

interface PhaseHeaderProps {
  phase: number;
  phaseData: PhaseData;
  editing: {
    type: 'milestone' | null;
    id: string | number | null;
    value: string;
  };
  isLoading: boolean;
  onClose: () => void;
  onStartEditing: (type: 'milestone', id: string | number, currentValue: string) => void;
  onCancelEditing: () => void;
  onSaveEdit: () => void;
  onEditingChange: (value: string) => void;
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
  phase,
  phaseData,
  editing,
  isLoading,
  onClose,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onEditingChange
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus edit inputs
  useEffect(() => {
    if (editing.type && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editing.type]);

  // Calculate progress metrics
  const totalTasks = phaseData.tasks.length;
  const completedCount = phaseData.tasks.filter(task => task.status === 'completed').length;
  const inProgressCount = phaseData.tasks.filter(task => task.status === 'in-progress').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  
  // Gamification calculations
  const completionStreak = calculateCompletionStreak(phaseData.tasks);
  const isPhaseComplete = completedCount === totalTasks && totalTasks > 0;
  const isCriticalPath = phaseData.critical;

  // Calculate completion streak
  function calculateCompletionStreak(tasks: Array<{ status: string }>): number {
    let streak = 0;
    for (let i = tasks.length - 1; i >= 0; i--) {
      if (tasks[i].status === 'completed') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Format dates for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate duration
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return `${diffDays} days`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm shadow-sm z-10 cursor-pointer"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
      
      {/* Phase Badge & Critical Indicator */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className={`
          inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105
          ${isCriticalPath 
            ? 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white shadow-xl shadow-red-500/30 ring-2 ring-red-300/50' 
            : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-300/50'
          }
        `}>
          {isCriticalPath && <BoltSolid className="w-5 h-5 animate-pulse" />}
          Phase {phase}
        </div>
        
        {/* Gamification Badges */}
        {isPhaseComplete && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-300/50 animate-bounce">
            <TrophyIcon className="w-5 h-5" />
            Complete
          </div>
        )}
        
        {completionStreak >= 3 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-orange-500/30 ring-2 ring-orange-300/50">
            <StarSolid className="w-5 h-5" />
            {completionStreak} streak
          </div>
        )}
      </div>
      
      {/* Title */}
      {editing.type === 'milestone' && editing.id === phase ? (
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <input
            ref={editInputRef}
            value={editing.value}
            onChange={(e) => onEditingChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit();
              if (e.key === 'Escape') onCancelEditing();
            }}
            className="text-4xl font-black text-slate-900 bg-transparent border-b-2 border-blue-500 focus:outline-none flex-1 placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={onSaveEdit}
            disabled={isLoading}
            className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm ring-1 ring-emerald-200 cursor-pointer"
          >
            <CheckIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onCancelEditing}
            className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors shadow-sm ring-1 ring-slate-200 cursor-pointer"
          >
            <CancelIcon className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div className="group flex items-start gap-4 mb-4 relative z-10">
          <h1 className="text-4xl font-black text-slate-900 leading-tight flex-1 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
            {phaseData.title}
          </h1>
          <button
            onClick={() => onStartEditing('milestone', phase, phaseData.title)}
            className="p-3 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm backdrop-blur-sm cursor-pointer"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tagline */}
      {phaseData.tagline && (
        <p className="text-base text-slate-600 mb-6 font-medium italic relative z-10">
          &ldquo;{phaseData.tagline}&rdquo;
        </p>
      )}
      
      {/* Enhanced Timeline & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Progress Ring */}
        <div className="flex items-center justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e2e8f0"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progressPercentage * 2.51} 251`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-black text-slate-900">{progressPercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Timeline Header */}
          <div className="flex items-center gap-3 mb-3">
            <CalendarDaysIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900">Timeline</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ClockIcon className="w-4 h-4" />
              {calculateDuration(phaseData.startDate, phaseData.endDate)}
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
                  <span className="text-sm font-semibold text-slate-700">Start</span>
                </div>
                <div className="text-base font-bold text-slate-900">{formatDate(phaseData.startDate)}</div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-700">End</span>
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg"></div>
                </div>
                <div className="text-base font-bold text-slate-900">{formatDate(phaseData.endDate)}</div>
              </div>
            </div>

            {/* Progress Line */}
            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
              </div>
            </div>

          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-4 h-4 bg-slate-400 rounded-full mx-auto mb-2"></div>
              <div className="text-2xl font-black text-slate-700">{totalTasks - completedCount - inProgressCount}</div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pending</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="w-4 h-4 bg-amber-500 rounded-full mx-auto mb-2"></div>
              <div className="text-2xl font-black text-amber-700">{inProgressCount}</div>
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">In Progress</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="w-4 h-4 bg-emerald-500 rounded-full mx-auto mb-2"></div>
              <div className="text-2xl font-black text-emerald-700">{completedCount}</div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Completed</div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}; 