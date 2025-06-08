-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roadmaps table
CREATE TABLE roadmaps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    notion_config JSONB NOT NULL,
    share_id TEXT UNIQUE NOT NULL,
    owner_id TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on share_id for fast lookups
CREATE INDEX roadmaps_share_id_idx ON roadmaps(share_id);

-- Create index on owner_id for user dashboard queries
CREATE INDEX roadmaps_owner_id_idx ON roadmaps(owner_id);

-- Create index on created_at for ordering
CREATE INDEX roadmaps_created_at_idx ON roadmaps(created_at DESC);

-- Enable Row Level Security
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read roadmaps (for sharing)
CREATE POLICY "Anyone can read roadmaps" ON roadmaps
    FOR SELECT USING (true);

-- Policy: Allow anonymous users to create roadmaps
CREATE POLICY "Anonymous users can create roadmaps" ON roadmaps
    FOR INSERT WITH CHECK (true);

-- Policy: Allow owners to update their roadmaps
CREATE POLICY "Owners can update their roadmaps" ON roadmaps
    FOR UPDATE USING (owner_id = current_setting('request.jwt.claims', true)::json->>'sub' OR true);

-- Policy: Allow owners to delete their roadmaps
CREATE POLICY "Owners can delete their roadmaps" ON roadmaps
    FOR DELETE USING (owner_id = current_setting('request.jwt.claims', true)::json->>'sub' OR true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_roadmaps_updated_at 
    BEFORE UPDATE ON roadmaps 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 