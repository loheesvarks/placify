-- Target Profiles table
CREATE TABLE IF NOT EXISTS public.target_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL,
  target_package_min DECIMAL(10, 2),
  target_package_max DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  target_companies TEXT[] DEFAULT '{}',
  available_hours_per_day DECIMAL(4, 2) CHECK (available_hours_per_day BETWEEN 1 AND 24),
  timeline_weeks INTEGER CHECK (timeline_weeks BETWEEN 1 AND 52),
  start_date DATE DEFAULT CURRENT_DATE,
  expected_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 10),
  category TEXT CHECK (category IN ('technical', 'soft', 'domain')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_target_profiles_user_id ON target_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);

-- RLS Policies for target_profiles
ALTER TABLE target_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own target profile" ON target_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own target profile" ON target_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own target profile" ON target_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own target profile" ON target_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills" ON skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills" ON skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills" ON skills
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_target_profiles_updated_at
  BEFORE UPDATE ON target_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
