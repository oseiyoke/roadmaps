'use client';

import { useState, useEffect } from 'react';

interface RoadmapPreviewProps {
  token: string;
  databases: {
    projects: string;
    tasks: string;
    name: string;
  };
  onComplete: () => void;
  onBack: () => void;
}

interface PreviewData {
  phases: number;
  tasks: number;
  completedTasks: number;
  hasLargeDataset?: boolean;
  message?: string;
}

export default function RoadmapPreview({ token, databases, onComplete, onBack }: RoadmapPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPreview();
  }, []);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      setError('');

      // Test the connection by fetching a preview
      const response = await fetch('/api/notion/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          projectsDatabaseId: databases.projects,
          tasksDatabaseId: databases.tasks
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to your databases');
      }

      const data = await response.json();
      setPreviewData({
        phases: data.phases || 0,
        tasks: data.tasks || 0,
        completedTasks: data.completedTasks || 0,
        hasLargeDataset: data.hasLargeDataset || false,
        message: data.message
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview roadmap');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your roadmap preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            ← Back to database selection
          </button>
          <button
            onClick={fetchPreview}
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const completionRate = previewData && previewData.tasks > 0 
    ? Math.round((previewData.completedTasks / previewData.tasks) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-3">Almost there!</h2>
        <p className="text-gray-700 text-lg">Here&apos;s what we found in your Notion workspace</p>
      </div>

      {/* Roadmap Preview */}
      <div className="bg-gray-50 rounded-xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-center">{databases.name}</h3>
        
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">{previewData?.phases || 0}</div>
            <div className="text-sm text-gray-700 mt-1">Phases</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{previewData?.tasks || 0}</div>
            <div className="text-sm text-gray-700 mt-1">Total Tasks</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{completionRate}%</div>
            <div className="text-sm text-gray-700 mt-1">Complete</div>
          </div>
        </div>

        {/* Large dataset notice */}
        {previewData?.hasLargeDataset && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Great! We found all {previewData.phases} phases and {previewData.tasks} tasks across multiple pages in your Notion workspace.
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <p className="text-green-800 font-medium">Connection successful!</p>
            <p className="text-green-700 text-sm mt-1">
              Your roadmap is ready to visualize. Click continue to see your interactive roadmap.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          ← Back
        </button>
        
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          View My Roadmap
        </button>
      </div>

      {/* Tips */}
      <div className="border-t pt-6">
        <p className="text-sm text-gray-700 text-center">
          💡 Tip: Keep updating your roadmap in Notion, and it will automatically sync here
        </p>
      </div>
    </div>
  );
} 