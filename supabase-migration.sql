-- Add is_verified field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  social_links TEXT,
  experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS verification_requests_user_id_idx ON verification_requests(user_id);

-- Create routes table if it doesn't exist
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  stops JSONB NOT NULL,
  duration INTEGER,
  distance INTEGER,
  directions JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indices for common queries
CREATE INDEX IF NOT EXISTS routes_user_id_idx ON routes(user_id);
CREATE INDEX IF NOT EXISTS routes_category_idx ON routes(category);
CREATE INDEX IF NOT EXISTS routes_is_featured_idx ON routes(is_featured) WHERE is_featured = TRUE;

-- Enable Row Level Security
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for routes table
CREATE POLICY "Public routes are viewable by everyone" 
ON routes FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own routes" 
ON routes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routes" 
ON routes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routes" 
ON routes FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for verification_requests table
CREATE POLICY "Users can view their own verification requests" 
ON verification_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests" 
ON verification_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id); 