-- ============================================================
-- LESSON COMPLETION TRACKING
-- Phase 3G: Learning Integration
-- ============================================================
-- This migration adds lesson completion tracking to enable
-- evidence capture for learning activities
-- ============================================================

-- ============================================================
-- LESSON COMPLETIONS TABLE
-- Tracks which lessons users have completed
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  time_spent_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON lesson_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson ON lesson_completions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user_completed ON lesson_completions(user_id, completed_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own lesson completions" ON lesson_completions;
CREATE POLICY "Users can view own lesson completions" ON lesson_completions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson completions" ON lesson_completions;
CREATE POLICY "Users can insert own lesson completions" ON lesson_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================
-- Note: No updated_at trigger needed as completions are immutable

-- ============================================================
-- END OF MIGRATION
-- ============================================================
