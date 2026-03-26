-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    health_score INT NOT NULL DEFAULT 50,
    tree_level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Can be linked to Supabase auth.users if needed via:
    -- id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    github_username TEXT,
    leetcode_username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Logs Table
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    passed_today BOOLEAN NOT NULL DEFAULT FALSE,
    commit_message TEXT,
    ai_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Row Level Security (RLS) Enable
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Basic permissive policies for MVP Hackathon
CREATE POLICY "Enable read/write for all users on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Enable read/write for all users on users" ON users FOR ALL USING (true);
CREATE POLICY "Enable read/write for all users on daily_logs" ON daily_logs FOR ALL USING (true);
