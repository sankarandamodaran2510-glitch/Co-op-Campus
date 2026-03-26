-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  garden_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create profiles table (linked to Auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  github_user TEXT,
  leetcode_user TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  level TEXT DEFAULT 'Seedling',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create active_trees table (tracks 7-day cycles)
CREATE TABLE IF NOT EXISTS active_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_count INTEGER DEFAULT 1 CHECK (day_count >= 1 AND day_count <= 7),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'harvested', 'withered')),
  UNIQUE(team_id, start_date)
);

-- Create habit_logs table (real-time verification results)
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tree_id UUID REFERENCES active_trees(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('github', 'leetcode', 'academic')),
  detail_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Everyone can see teams, but only members can modify)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Team-based policies
CREATE POLICY "Trees are viewable by everyone" ON active_trees FOR SELECT USING (true);
CREATE POLICY "Team members can update their tree" ON active_trees FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.team_id = active_trees.team_id));
