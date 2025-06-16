'use client';

import React from 'react';
import { TaskTimeline } from './TaskTimeline';
import { PhaseData } from '@/app/types/roadmap';

// Sample data to demonstrate the timeline with dates
const samplePhaseData: PhaseData = {
  title: "Phase 1: Foundation Setup",
  tagline: "Building the core infrastructure",
  status: "in-progress",
  startDate: "December 1, 2024",
  endDate: "January 15, 2025",
  critical: true,
  tasks: [
    {
      name: "Set up development environment",
      status: "completed",
      startDate: "December 1, 2024",
      endDate: "December 5, 2024"
    },
    {
      name: "Design system architecture",
      status: "completed",
      startDate: "December 3, 2024",
      endDate: "December 10, 2024"
    },
    {
      name: "Implement authentication system",
      status: "in-progress",
      startDate: "December 8, 2024",
      endDate: "December 20, 2024"
    },
    {
      name: "Create database schema",
      status: "in-progress",
      startDate: "December 12, 2024",
      endDate: "December 18, 2024"
    },
    {
      name: "Set up CI/CD pipeline",
      status: "pending",
      startDate: "December 15, 2024",
      endDate: "December 25, 2024"
    },
    {
      name: "Write comprehensive tests",
      status: "pending",
      startDate: "December 20, 2024",
      endDate: "January 10, 2025"
    },
    {
      name: "Deploy to staging environment",
      status: "pending",
      startDate: "January 5, 2025",
      endDate: "January 15, 2025"
    }
  ],
  content: [],
  icon: {
    type: 'emoji',
    emoji: '🚀'
  }
};

export const TaskTimelineDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Task Timeline Demo</h1>
        <p className="text-slate-600">
          This demonstrates the beautiful task timeline with start and end dates for each task.
        </p>
      </div>
      
      <TaskTimeline phaseData={samplePhaseData} />
    </div>
  );
}; 