'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with localStorage
const RoadmapViewer = dynamic(() => import('../../components/roadmap').then(mod => mod.RoadmapViewer), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  )
});

interface RoadmapConfig {
  id: string;
  name: string;
  platform: string;
  notionConfig?: {
    accessToken: string;
    projectsDatabaseId: string;
    tasksDatabaseId: string;
  };
}

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmapConfig, setRoadmapConfig] = useState<RoadmapConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoadmapConfig = () => {
      try {
        const roadmapsStr = localStorage.getItem('roadmaps');
        if (!roadmapsStr) {
          setError('No roadmaps found');
          setLoading(false);
          return;
        }

        const roadmaps = JSON.parse(roadmapsStr);
        const config = roadmaps.find((r: RoadmapConfig) => r.id === params.id);
        
        if (!config) {
          setError('Roadmap not found');
          setLoading(false);
          return;
        }

        setRoadmapConfig(config);
      } catch (err) {
        console.error('Error loading roadmap:', err);
        setError('Failed to load roadmap configuration');
      } finally {
        setLoading(false);
      }
    };

    loadRoadmapConfig();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !roadmapConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Roadmap not found</h2>
          <p className="text-gray-700 mb-6">{error || 'The roadmap you&apos;re looking for doesn&apos;t exist.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <RoadmapViewer config={roadmapConfig} />;
} 