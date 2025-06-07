'use client';

import { useState, useEffect } from 'react';

interface Database {
  id: string;
  title: string;
  object: string;
  icon?: {
    type: string;
    emoji?: string;
  };
}

interface DatabaseSelectorProps {
  token: string;
  onComplete: (databases: { projects: string; tasks: string; name: string }) => void;
  onBack: () => void;
}

export default function DatabaseSelector({ token, onComplete, onBack }: DatabaseSelectorProps) {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProjects, setSelectedProjects] = useState('');
  const [selectedTasks, setSelectedTasks] = useState('');
  const [roadmapName, setRoadmapName] = useState('');

  useEffect(() => {
    discoverDatabases();
  }, [token]);

  const discoverDatabases = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/notion/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Failed to discover databases');
      }

      const data = await response.json();
      setDatabases(data.databases || []);
      
      // Auto-detect common database names
      const projectsDb = data.databases.find((db: Database) => 
        db.title.toLowerCase().includes('project') || 
        db.title.toLowerCase().includes('phase') ||
        db.title.toLowerCase().includes('milestone')
      );
      const tasksDb = data.databases.find((db: Database) => 
        db.title.toLowerCase().includes('task')
      );
      
      if (projectsDb) setSelectedProjects(projectsDb.id);
      if (tasksDb) setSelectedTasks(tasksDb.id);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load databases');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedProjects && selectedTasks && roadmapName) {
      onComplete({
        projects: selectedProjects,
        tasks: selectedTasks,
        name: roadmapName
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Discovering your Notion databases...</p>
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
        <button
          onClick={onBack}
          className="text-gray-700 hover:text-gray-900"
        >
          ← Back to token setup
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-3">Select your databases</h2>
        <p className="text-gray-700 text-lg">Choose which databases contain your roadmap data</p>
      </div>

      {/* Important Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> Make sure you&apos;ve shared both databases with your integration:
        </p>
        <ol className="mt-2 text-sm text-amber-700 space-y-1 list-decimal list-inside">
          <li>
            <a href="https://www.notion.so/profile/integrations" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700"> 
            Open your Integration Token Page  {' '}
            </a>
            from your list of integration tokens
          </li>
          <li>Click on the <b>Access</b> tab</li>
          <li>Grant access to the relevant Notion pages</li>
          <li>Refresh this page</li>
        </ol>
      </div>

      {/* Database Selection */}
      <div className="space-y-6">
        {/* Roadmap Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roadmap Name
          </label>
          <input
            type="text"
            value={roadmapName}
            onChange={(e) => setRoadmapName(e.target.value)}
            placeholder="e.g., Product Roadmap 2024"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Projects Database */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Projects/Phases Database
          </label>
          <select
            value={selectedProjects}
            onChange={(e) => setSelectedProjects(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select a database...</option>
            {databases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.icon?.emoji && `${db.icon.emoji} `}
                {db.title}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-600">
            This should contain your project phases or milestones
          </p>
        </div>

        {/* Tasks Database */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tasks Database
          </label>
          <select
            value={selectedTasks}
            onChange={(e) => setSelectedTasks(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select a database...</option>
            {databases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.icon?.emoji && `${db.icon.emoji} `}
                {db.title}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-600">
            This should contain tasks linked to your projects
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="text-gray-700 hover:text-gray-900"
        >
          ← Back
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedProjects || !selectedTasks || !roadmapName}
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>

      {/* Database Info */}
      {databases.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-700">No databases found. Make sure you&apos;ve:</p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>Created databases in your Notion workspace</li>
            <li>Shared them with your integration</li>
          </ul>
        </div>
      )}
    </div>
  );
} 