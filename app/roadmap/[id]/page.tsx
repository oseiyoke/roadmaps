'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getRoadmapById } from '@/lib/supabase';
import { debugLog, debugError, checkSupabaseConfig } from '@/lib/debug';

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
  shareId?: string;
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
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const loadRoadmapConfig = async () => {
      debugLog(`Loading roadmap with ID: ${params.id}`);
      checkSupabaseConfig();
      
      try {
        debugLog('Attempting to load from Supabase...');
        const roadmap = await getRoadmapById(params.id as string);
        
        if (roadmap) {
          debugLog('Roadmap loaded from Supabase:', roadmap);
          setRoadmapConfig({
            id: roadmap.id,
            name: roadmap.name,
            platform: roadmap.platform,
            notionConfig: roadmap.notion_config,
            shareId: roadmap.share_id,
          });
          setLoading(false);
          return;
        }
        
        debugLog('Roadmap not found in Supabase, trying localStorage...');
        // If not found in Supabase, try localStorage as fallback
        const roadmapsStr = localStorage.getItem('roadmaps');
        if (roadmapsStr) {
          const roadmaps = JSON.parse(roadmapsStr);
          const config = roadmaps.find((r: RoadmapConfig) => r.id === params.id);
          
          if (config) {
            debugLog('Roadmap found in localStorage:', config);
            setRoadmapConfig(config);
            setLoading(false);
            return;
          }
        }
        
        debugLog('Roadmap not found anywhere');
        setError('Roadmap not found');
        setLoading(false);
      } catch (err) {
        debugError('Error loading roadmap from Supabase:', err);
        
        // Fallback to localStorage on error
        try {
          debugLog('Falling back to localStorage...');
          const roadmapsStr = localStorage.getItem('roadmaps');
          if (roadmapsStr) {
            const roadmaps = JSON.parse(roadmapsStr);
            const config = roadmaps.find((r: RoadmapConfig) => r.id === params.id);
            
            if (config) {
              debugLog('Roadmap found in localStorage fallback:', config);
              setRoadmapConfig(config);
              setLoading(false);
              return;
            }
          }
        } catch (localErr) {
          debugError('Failed to load from localStorage:', localErr);
        }
        
        debugError('All loading methods failed');
        setError('Failed to load roadmap configuration');
        setLoading(false);
      }
    };

    loadRoadmapConfig();
  }, [params.id]);

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
          <p className="text-gray-700 mb-6">{error || 'The roadmap you\'re looking for doesn\'t exist.'}</p>
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

  if (isMobileView) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Mobile view not available</h2>
        <p className="text-gray-700 mb-6">Please view this roadmap on the web (desktop) for the full experience.</p>
      </div>
    );
  }

  return <RoadmapViewer config={roadmapConfig} />;
} 