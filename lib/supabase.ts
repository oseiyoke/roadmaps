import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Check configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface RoadmapRecord {
  id: string;
  name: string;
  platform: string;
  notion_config: {
    accessToken: string;
    projectsDatabaseId: string;
    tasksDatabaseId: string;
  };
  share_id: string;
  owner_id?: string;
  created_at: string;
  updated_at: string;
  last_synced: string;
  view_count: number;
}

// Utilities
export function generateShareId(): string {
  // Generate a short, URL-friendly ID for sharing
  return nanoid(8); // e.g., "Vb7Ht3Kp"
}

// Encrypt sensitive data (client-side encryption before storing)
export async function encryptNotionConfig(config: {
  accessToken: string;
  projectsDatabaseId: string;
  tasksDatabaseId: string;
}): Promise<string> {
  // For now, we'll use base64 encoding. In production, use proper encryption
  // Consider using SubtleCrypto API or a library like crypto-js
  return btoa(JSON.stringify(config));
}

// Decrypt sensitive data
export async function decryptNotionConfig(encryptedConfig: string): Promise<{
  accessToken: string;
  projectsDatabaseId: string;
  tasksDatabaseId: string;
} | null> {
  try {
    return JSON.parse(atob(encryptedConfig));
  } catch (error) {
    console.error('Failed to decrypt config:', error);
    return null;
  }
}

// Get or create anonymous user ID
export function getAnonymousUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
}

// Database operations
export async function createRoadmap(roadmap: {
  name: string;
  platform: string;
  notionConfig: {
    accessToken: string;
    projectsDatabaseId: string;
    tasksDatabaseId: string;
  };
}) {
  const shareId = generateShareId();
  const ownerId = getAnonymousUserId();
  const encryptedConfig = await encryptNotionConfig(roadmap.notionConfig);
  
  const { data, error } = await supabase
    .from('roadmaps')
    .insert({
      name: roadmap.name,
      platform: roadmap.platform,
      notion_config: encryptedConfig,
      share_id: shareId,
      owner_id: ownerId,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getRoadmapByShareId(shareId: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('share_id', shareId)
    .single();
    
  if (error) throw error;
  
  // Decrypt the config
  if (data && data.notion_config) {
    data.notion_config = await decryptNotionConfig(data.notion_config);
  }
  
  // Increment view count
  await supabase
    .from('roadmaps')
    .update({ view_count: data.view_count + 1 })
    .eq('id', data.id);
    
  return data;
}

export async function getRoadmapById(id: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  
  // Decrypt the config
  if (data && data.notion_config) {
    data.notion_config = await decryptNotionConfig(data.notion_config);
  }
  
  return data;
}

export async function updateRoadmap(id: string, updates: Partial<RoadmapRecord>) {
  // Create a copy of updates to modify
  const updatesToSend: Record<string, unknown> = { ...updates };
  
  // If updating notion_config, encrypt it first
  if (updates.notion_config) {
    updatesToSend.notion_config = await encryptNotionConfig(updates.notion_config);
  }
  
  const { data, error } = await supabase
    .from('roadmaps')
    .update({
      ...updatesToSend,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getUserRoadmaps() {
  const userId = getAnonymousUserId();
  
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Decrypt configs
  if (data) {
    for (const roadmap of data) {
      if (roadmap.notion_config) {
        roadmap.notion_config = await decryptNotionConfig(roadmap.notion_config);
      }
    }
  }
  
  return data || [];
} 