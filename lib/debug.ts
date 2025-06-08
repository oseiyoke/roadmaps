// Debug utilities for troubleshooting Supabase integration

export function debugLog(message: string, data?: unknown) {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true' || typeof window !== 'undefined') {
    console.log(`[ROADMAP DEBUG] ${message}`, data);
  }
}

export function debugError(message: string, error?: unknown) {
  console.error(`[ROADMAP ERROR] ${message}`, error);
}

export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  debugLog('Checking Supabase configuration:', {
    hasUrl: !!url,
    hasKey: !!key,
    urlPrefix: url ? url.slice(0, 20) + '...' : 'missing',
    keyPrefix: key ? key.slice(0, 20) + '...' : 'missing'
  });
  
  return {
    isConfigured: !!url && !!key,
    url,
    key
  };
}

export function debugUserInfo() {
  if (typeof window === 'undefined') return null;
  
  const userId = localStorage.getItem('anonymous_user_id');
  const roadmaps = localStorage.getItem('roadmaps');
  
  debugLog('User info:', {
    hasUserId: !!userId,
    userId: userId,
    localRoadmaps: roadmaps ? JSON.parse(roadmaps).length : 0
  });
  
  return {
    userId,
    localRoadmapCount: roadmaps ? JSON.parse(roadmaps).length : 0
  };
} 