'use client';

import React, { useState, useEffect } from 'react';
import { PhaseData } from '@/app/types/roadmap';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { PhaseHeader } from './PhaseHeader';
import { TabNavigation } from './TabNavigation';
import { TaskList } from './TaskList';
import { TaskTimeline } from './TaskTimeline';
import { ContentBlockRenderer } from './content-blocks';

interface SideDrawerProps {
  isOpen: boolean;
  phase: number | null;
  phaseData: PhaseData | null;
  onClose: () => void;
  onRefresh?: () => void;
}

interface EditingState {
  type: 'milestone' | null;
  id: string | number | null;
  value: string;
}

type TabType = 'content' | 'tasks' | 'timeline';

export const SideDrawer: React.FC<SideDrawerProps> = ({ 
  isOpen, 
  phase, 
  phaseData, 
  onClose, 
  onRefresh 
}) => {
  const [editing, setEditing] = useState<EditingState>({ type: null, id: null, value: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('timeline');

  // Debug logging
  useEffect(() => {

  }, [phase, phaseData]);

  if (!phaseData || phase === null) return null;

  // Calculate progress metrics
  const totalTasks = phaseData.tasks.length;
  const completedCount = phaseData.tasks.filter(task => task.status === 'completed').length;

  // Handle editing milestone
  const startEditing = (type: 'milestone', id: string | number, currentValue: string) => {
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
      }
      
      onRefresh?.();
      cancelEditing();
    } catch (error) {
      console.error('Error saving edit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditingChange = (value: string) => {
    setEditing(prev => ({ ...prev, value }));
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
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Header - Now Scrollable */}
          <PhaseHeader
            phase={phase}
            phaseData={phaseData}
            editing={editing}
            isLoading={isLoading}
            onClose={onClose}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onSaveEdit={saveEdit}
            onEditingChange={handleEditingChange}
          />

          {/* Tab Navigation - Sticky */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            completedCount={completedCount}
            totalTasks={totalTasks}
          />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'content' ? (
              <div className="space-y-6">
                {/* Flexible Content Blocks */}
                {phaseData.content && phaseData.content.length > 0 ? (
                  <ContentBlockRenderer blocks={phaseData.content} />
                ) : (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No content available for this phase</p>
                  </div>
                )}
              </div>
            ) : activeTab === 'tasks' ? (
              /* Tasks Tab */
              <TaskList phaseData={phaseData} />
            ) : (
              /* Timeline Tab */
              <TaskTimeline phaseData={phaseData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}; 