'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PhaseData } from '@/app/types/roadmap';
import { 
  XMarkIcon, 
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon as CancelIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleSolid,
  StarIcon as StarSolid,
  BoltIcon as BoltSolid 
} from '@heroicons/react/24/solid';

interface SideDrawerProps {
  isOpen: boolean;
  phase: number | null;
  phaseData: PhaseData | null;
  onClose: () => void;
  onRefresh?: () => void;
}

interface EditingState {
  type: 'milestone' | 'task' | null;
  id: string | number | null;
  value: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ 
  isOpen, 
  phase, 
  phaseData, 
  onClose, 
  onRefresh 
}) => {
  const [editing, setEditing] = useState<EditingState>({ type: null, id: null, value: '' });
  const [newTaskName, setNewTaskName] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const newTaskInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus edit inputs
  useEffect(() => {
    if (editing.type && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editing.type]);

  useEffect(() => {
    if (isAddingTask && newTaskInputRef.current) {
      newTaskInputRef.current.focus();
    }
  }, [isAddingTask]);

  if (!phaseData || phase === null) return null;

  // Calculate progress metrics
  const totalTasks = phaseData.tasks.length;
  const completedCount = phaseData.tasks.filter(task => task.status === 'completed').length;
  const inProgressCount = phaseData.tasks.filter(task => task.status === 'in-progress').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  
  // Gamification calculations
  const completionStreak = calculateCompletionStreak(phaseData.tasks);
  const isPhaseComplete = completedCount === totalTasks && totalTasks > 0;
  const isCriticalPath = phaseData.critical;

  // Handle task status change
  const handleTaskStatusChange = async (taskIndex: number, newStatus: string) => {
    if (!phaseData) return;
    
    setIsLoading(true);
    try {
      // Optimistic update
      const updatedTasks = [...phaseData.tasks];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: newStatus as 'completed' | 'in-progress' | 'pending' };
      
      // Call API to update in Notion
      const response = await fetch(`/api/notion/tasks/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phaseId: phase,
          taskIndex,
          status: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      // Add celebration effect for completions
      if (newStatus === 'completed') {
        setCompletedTasks(prev => new Set([...prev, taskIndex]));
        setTimeout(() => {
          setCompletedTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(taskIndex);
            return newSet;
          });
        }, 2000);
      }
      
      onRefresh?.();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing
  const startEditing = (type: 'milestone' | 'task', id: string | number, currentValue: string) => {
    setEditing({ type, id, value: currentValue });
  };

  const cancelEditing = () => {
    setEditing({ type: null, id: null, value: '' });
  };

  const saveEdit = async () => {
    if (!editing.type || editing.id === null) return;
    
    setIsLoading(true);
    try {
      if (editing.type === 'milestone') {
        await fetch('/api/notion/phases/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phaseId: phase,
            title: editing.value
          })
        });
      } else if (editing.type === 'task') {
        await fetch('/api/notion/tasks/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phaseId: phase,
            taskIndex: editing.id,
            name: editing.value
          })
        });
      }
      
      onRefresh?.();
      cancelEditing();
    } catch (error) {
      console.error('Error saving edit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new task
  const addNewTask = async () => {
    if (!newTaskName.trim()) return;
    
    setIsLoading(true);
    try {
      await fetch('/api/notion/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phaseId: phase,
          name: newTaskName,
          status: 'pending'
        })
      });
      
      setNewTaskName('');
      setIsAddingTask(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task deletion
  const deleteTask = async (taskIndex: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setIsLoading(true);
    try {
      await fetch('/api/notion/tasks/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phaseId: phase,
          taskIndex
        })
      });
      
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
    <>
      {/* Overlay */}
      <div 
        className={`
          fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-all duration-300 z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`
          fixed right-0 top-0 w-full max-w-2xl h-full bg-white shadow-2xl
          transition-transform duration-300 z-50 overflow-hidden flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#334155" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          {/* Phase Badge & Critical Indicator */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
              ${isCriticalPath 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
              }
            `}>
              {isCriticalPath && <BoltSolid className="w-4 h-4" />}
              Phase {phase}
            </div>
            
            {/* Gamification Badges */}
            {isPhaseComplete && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-medium shadow-lg shadow-emerald-500/25">
                <TrophyIcon className="w-4 h-4" />
                Complete
              </div>
            )}
            
            {completionStreak >= 3 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-medium shadow-lg shadow-orange-500/25">
                <StarSolid className="w-4 h-4" />
                {completionStreak} streak
              </div>
            )}
          </div>
          
          {/* Title */}
          {editing.type === 'milestone' && editing.id === phase ? (
            <div className="flex items-center gap-3 mb-4">
              <input
                ref={editInputRef}
                value={editing.value}
                onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEditing();
                }}
                className="text-3xl font-bold text-slate-900 bg-transparent border-b-2 border-blue-500 focus:outline-none flex-1"
                disabled={isLoading}
              />
              <button
                onClick={saveEdit}
                disabled={isLoading}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
              <button
                onClick={cancelEditing}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CancelIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="group flex items-start gap-3 mb-4">
              <h2 className="text-3xl font-bold text-slate-900 leading-tight flex-1">
                {phaseData.title}
              </h2>
              <button
                onClick={() => startEditing('milestone', phase, phaseData.title)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Progress Ring & Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPercentage * 2.51} 251`}
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-900">{progressPercentage}%</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600">{completedCount} completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-600">{inProgressCount} in progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                  <span className="text-slate-600">{totalTasks - completedCount - inProgressCount} pending</span>
                </div>
              </div>
              
              <div className="flex gap-6 text-sm text-slate-500">
                <div>{phaseData.startDate}</div>
                <div>→</div>
                <div>{phaseData.endDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* About Section */}
            {phaseData.about && (
              <section className="space-y-4">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <DocumentTextIcon className="w-5 h-5 text-slate-500" />
                  About this project
                </h3>
                <div className="p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{phaseData.about}</p>
                </div>
              </section>
            )}

            {/* Tasks Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-slate-500" />
                  Tasks
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg font-medium">
                    {completedCount}/{totalTasks}
                  </span>
                </h3>
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/25"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Task
                </button>
              </div>
              
              <div className="space-y-2">
                {/* Add New Task Input */}
                {isAddingTask && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-300 rounded-full bg-white"></div>
                      <input
                        ref={newTaskInputRef}
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addNewTask();
                          if (e.key === 'Escape') {
                            setIsAddingTask(false);
                            setNewTaskName('');
                          }
                        }}
                        placeholder="Enter task name..."
                        className="flex-1 bg-transparent text-slate-900 placeholder-slate-500 focus:outline-none"
                        disabled={isLoading}
                      />
                      <button
                        onClick={addNewTask}
                        disabled={isLoading || !newTaskName.trim()}
                        className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors disabled:opacity-50"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingTask(false);
                          setNewTaskName('');
                        }}
                        className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                      >
                        <CancelIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Task List */}
                {phaseData.tasks
                  .slice()  // Create a copy to avoid mutating original array
                  .sort((a, b) => {
                    // Sort priority: completed -> in-progress -> pending
                    const statusOrder = { 'completed': 0, 'in-progress': 1, 'pending': 2 };
                    return statusOrder[a.status] - statusOrder[b.status];
                  })
                  .map((task) => {
                    // Find original index for operations that need it
                    const originalIndex = phaseData.tasks.findIndex(t => t === task);
                    return { task, originalIndex };
                  })
                  .map(({ task, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className={`
                      group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md
                      ${task.status === 'completed' 
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:shadow-emerald-500/10' 
                        : task.status === 'in-progress'
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:shadow-amber-500/10'
                        : 'bg-white border-slate-200 hover:shadow-slate-500/10'
                      }
                      ${completedTasks.has(originalIndex) ? 'animate-pulse' : ''}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Status Button */}
                      <button
                        onClick={() => {
                          const nextStatus = task.status === 'pending' 
                            ? 'in-progress' 
                            : task.status === 'in-progress' 
                            ? 'completed' 
                            : 'pending';
                          handleTaskStatusChange(originalIndex, nextStatus);
                        }}
                        disabled={isLoading}
                        className="transition-transform duration-200 hover:scale-110 disabled:opacity-50"
                      >
                        {getTaskStatusIcon(task.status)}
                      </button>
                      
                      {/* Task Name */}
                      {editing.type === 'task' && editing.id === originalIndex ? (
                        <input
                          ref={editInputRef}
                          value={editing.value}
                          onChange={(e) => setEditing(prev => ({ ...prev, value: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          className="flex-1 bg-transparent text-slate-900 border-b border-blue-500 focus:outline-none"
                          disabled={isLoading}
                        />
                      ) : (
                        <span 
                          className={`
                            flex-1 text-slate-900 leading-relaxed cursor-pointer
                            ${task.status === 'completed' ? 'line-through opacity-75' : ''}
                          `}
                          onClick={() => startEditing('task', originalIndex, task.name)}
                        >
                          {task.name}
                        </span>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editing.type === 'task' && editing.id === originalIndex ? (
                          <>
                            <button
                              onClick={saveEdit}
                              disabled={isLoading}
                              className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                            >
                              <CancelIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing('task', originalIndex, task.name)}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTask(originalIndex)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Celebration Effect */}
                    {completedTasks.has(originalIndex) && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Pain Points Section */}
            {phaseData.painPoints && phaseData.painPoints.length > 0 && (
              <section className="space-y-4">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <ExclamationTriangleIcon className="w-5 h-5 text-slate-500" />
                  Pain Points Addressed
                </h3>
                <div className="space-y-3">
                  {phaseData.painPoints.map((point, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                      <p className="text-slate-700 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outcomes Section */}
            {phaseData.outcomes && phaseData.outcomes.length > 0 && (
              <section className="space-y-4">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <CheckCircleIcon className="w-5 h-5 text-slate-500" />
                  Expected Outcomes
                </h3>
                <div className="space-y-3">
                  {phaseData.outcomes.map((outcome, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                      <p className="text-slate-700 leading-relaxed">{outcome}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Requirements Section */}
            {phaseData.requirements && phaseData.requirements.length > 0 && (
              <section className="space-y-4">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <DocumentTextIcon className="w-5 h-5 text-slate-500" />
                  Requirements & Prerequisites
                </h3>
                <div className="space-y-3">
                  {phaseData.requirements.map((req, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                      <p className="text-slate-700 leading-relaxed">{req}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Dependencies Section */}
            {phaseData.dependencies && phaseData.dependencies.length > 0 && (
              <section className="space-y-4">
                <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                  <UserGroupIcon className="w-5 h-5 text-slate-500" />
                  Dependencies
                </h3>
                <div className="space-y-3">
                  {phaseData.dependencies.map((dep, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                      <p className="text-slate-700 leading-relaxed">{dep}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}; 