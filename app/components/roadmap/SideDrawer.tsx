'use client';

import React from 'react';
import { PhaseData } from '@/app/types/roadmap';
import { 
  XMarkIcon, 
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface SideDrawerProps {
  isOpen: boolean;
  phase: number | null;
  phaseData: PhaseData | null;
  onClose: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, phase, phaseData, onClose }) => {
  if (!phaseData || phase === null) return null;

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '◐';
      default:
        return '';
    }
  };

  const getTaskStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'in-progress':
        return 'bg-orange-500 border-orange-500';
      default:
        return 'bg-white border-gray-300';
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 z-40
          ${isOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`
          fixed right-0 top-0 w-full max-w-lg h-full bg-white shadow-2xl
          transition-transform duration-300 z-50 overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className={`
            inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3
            ${phaseData.critical ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
          `}>
            Phase {phase}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{phaseData.title}</h2>
          
          <div className="flex gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Start Date</div>
              <div className="text-sm font-semibold text-gray-800">{phaseData.startDate}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">End Date</div>
              <div className="text-sm font-semibold text-gray-800">{phaseData.endDate}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* About Section */}
          {phaseData.about && (
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                About this project
              </h3>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">{phaseData.about}</p>
              </div>
            </section>
          )}

          {/* Tasks Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400" />
              Tasks
            </h3>
            <ul className="space-y-3">
              {phaseData.tasks.map((task, index) => (
                <li key={index} className={`
                  flex items-center gap-3 p-3 rounded-lg border
                  ${task.status === 'completed' ? 'bg-green-50 border-green-200' : 
                    task.status === 'in-progress' ? 'bg-orange-50 border-orange-200' : 
                    'bg-gray-50 border-gray-200'}
                `}>
                  <div className={`
                    w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold
                    ${getTaskStatusClass(task.status)}
                  `}>
                    {getTaskStatusIcon(task.status)}
                  </div>
                  <span className="text-sm text-gray-700">{task.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pain Points Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />
              Pain Points Addressed
            </h3>
            <div className="space-y-3">
              {phaseData.painPoints.map((point, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Outcomes Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <CheckCircleIcon className="w-5 h-5 text-gray-400" />
              Expected Outcomes
            </h3>
            <div className="space-y-3">
              {phaseData.outcomes.map((outcome, index) => (
                <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-gray-700">{outcome}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements Section */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              Requirements & Prerequisites
            </h3>
            <div className="space-y-3">
              {phaseData.requirements.map((req, index) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">{req}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dependencies Section */}
          {phaseData.dependencies && phaseData.dependencies.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <UserGroupIcon className="w-5 h-5 text-gray-400" />
                Dependencies
              </h3>
              <div className="space-y-3">
                {phaseData.dependencies.map((dep, index) => (
                  <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-gray-700">{dep}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}; 