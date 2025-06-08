'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getRoadmapByShareId } from '@/lib/supabase';

// Dynamic import to avoid SSR issues
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
  shareId?: string;
}

export default function SharedRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmapConfig, setRoadmapConfig] = useState<RoadmapConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const loadSharedRoadmap = async () => {
      try {
        const roadmap = await getRoadmapByShareId(params.shareId as string);
        if (roadmap) {
          setRoadmapConfig({
            id: roadmap.id,
            name: roadmap.name,
            platform: roadmap.platform,
            notionConfig: roadmap.notion_config,
            shareId: roadmap.share_id,
          });
          
          // Save to localStorage for offline access
          const existingRoadmaps = localStorage.getItem('roadmaps');
          const roadmaps = existingRoadmaps ? JSON.parse(existingRoadmaps) : [];
          
          // Check if this roadmap is already saved
          const existingIndex = roadmaps.findIndex((r: RoadmapConfig) => r.id === roadmap.id);
          if (existingIndex === -1) {
            roadmaps.push({
              id: roadmap.id,
              name: roadmap.name,
              platform: roadmap.platform,
              notionConfig: roadmap.notion_config,
              shareId: roadmap.share_id,
              isShared: true,
              addedAt: new Date().toISOString(),
            });
            localStorage.setItem('roadmaps', JSON.stringify(roadmaps));
          }
        } else {
          setError('Shared roadmap not found');
        }
      } catch (err) {
        console.error('Error loading shared roadmap:', err);
        setError('Failed to load shared roadmap');
      } finally {
        setLoading(false);
      }
    };

    loadSharedRoadmap();
  }, [params.shareId]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          <p className="text-gray-700 mb-6">{error || 'The shared roadmap doesn&apos;t exist or has been removed.'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (isMobileView) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Mobile view not available</h2>
        <p className="text-gray-700 mb-6">Please view this roadmap on the web (desktop) for the full experience.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Share banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 010-5.368m0 5.368a9.001 9.001 0 01-5.368 0m5.368 0c-.751.925-1.675 1.66-2.684 2.152m-9.032-4.026A9.001 9.001 0 015.368 5m9.032 0A9.001 9.001 0 019.032 5m5.368 0c.392.383.751.798 1.074 1.242M5.368 5c-.392.383-.751.798-1.074 1.242" />
              </svg>
              <span className="text-sm text-blue-800">
                You&apos;re viewing a shared roadmap: <strong>{roadmapConfig.name}</strong>
              </span>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View My Roadmaps
            </button>
          </div>
        </div>
      </div>
      
      {/* Roadmap viewer */}
      <RoadmapViewer config={roadmapConfig} />
    </div>
  );
} 