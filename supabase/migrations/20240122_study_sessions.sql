-- ============================================================
-- STUDY SESSIONS
-- Phase 3J: Study session tracking
-- ============================================================
-- Tracks Focus Timer sessions and study time
-- IMPORTANT: Study time ≠ Skill mastery
-- ============================================================

-- ============================================================
-- STUDY SESSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  focus_type TEXT DEFAULT 'general' CHECK (focus_type IN ('general', 'learning', 'practice', 'project', 'review')),
  notes TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_sessions_skill ON study_sessions(skill_id) WHERE skill_id IS NOT NULL;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own study sessions" ON study_sessions;
CREATE POLICY "Users can view own study sessions" ON study_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own study sessions" ON study_sessions;
CREATE POLICY "Users can insert own study sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- END OF MIGRATION
-- ============================================================
