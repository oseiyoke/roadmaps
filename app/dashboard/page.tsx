'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RoadmapConnection {
  id: string;
  name: string;
  platform: string;
  createdAt: string;
  lastSynced: string;
  stats?: {
    phases: number;
    tasks: number;
    completion: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<RoadmapConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('roadmaps');
      if (stored) {
        const roadmapList = JSON.parse(stored);
        setRoadmaps(roadmapList);
      }
    } catch (error) {
      console.error('Failed to load roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this roadmap?')) {
      const updated = roadmaps.filter(r => r.id !== id);
      localStorage.setItem('roadmaps', JSON.stringify(updated));
      setRoadmaps(updated);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="w-10 h-10 bg-black rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold">My Roadmaps</h1>
            </div>
            
            <button
              onClick={() => router.push('/onboarding')}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Connect New Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {roadmaps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No roadmaps yet</h2>
            <p className="text-gray-700 mb-6">Connect your first roadmap to get started</p>
            <button
              onClick={() => router.push('/onboarding')}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Connect Your First Roadmap
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <div key={roadmap.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <Link href={`/roadmap/${roadmap.id}`} className="block p-6">
                  {/* Roadmap Preview */}
                  <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  
                  {/* Roadmap Info */}
                  <h3 className="text-lg font-semibold mb-2">{roadmap.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Last synced {formatDate(roadmap.lastSynced)}
                  </div>
                  
                  {/* Stats */}
                  {roadmap.stats && (
                    <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-lg font-semibold">{roadmap.stats.phases}</div>
                        <div className="text-xs text-gray-600">Phases</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{roadmap.stats.tasks}</div>
                        <div className="text-xs text-gray-600">Tasks</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{roadmap.stats.completion}%</div>
                        <div className="text-xs text-gray-600">Done</div>
                      </div>
                    </div>
                  )}
                </Link>
                
                {/* Actions */}
                <div className="px-6 pb-6 flex gap-2">
                  <Link 
                    href={`/roadmap/${roadmap.id}`}
                    className="flex-1 text-center py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(roadmap.id)}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 