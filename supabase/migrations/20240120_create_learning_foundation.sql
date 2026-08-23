-- ============================================================
-- PLACIFY DATABASE FOUNDATION
-- Phase 2: Learning, Progress, and Activity Tables
-- ============================================================
-- This migration creates the core tables needed for:
-- - Courses and Lessons
-- - Learning Progress
-- - Coding Practice
-- - Study Sessions (Focus Timer persistence)
-- - Tasks and Activity
-- - XP and Streaks
-- - Roadmaps and Quizzes
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE (if not exists)
-- ============================================================
-- This table should be created automatically by Supabase Auth
-- but we ensure it exists with proper structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light')),
  notification_preferences JSONB DEFAULT '{"email": true, "inApp": true, "reminders": true, "weeklyReview": true, "milestones": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. HELPER FUNCTIONS
-- ============================================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  thumbnail_url TEXT,
  estimated_minutes INTEGER CHECK (estimated_minutes > 0),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  order_index INTEGER NOT NULL CHECK (order_index >= 0),
  estimated_minutes INTEGER CHECK (estimated_minutes > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- ============================================================
-- 5. LESSON PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================================
-- 6. CODING PROBLEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coding_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  external_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. PROBLEM PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.problem_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES coding_problems(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'attempted', 'solved')),
  attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
  solved_at TIMESTAMPTZ,
  last_attempted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- ============================================================
-- 8. STUDY SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER CHECK (duration_minutes >= 0),
  session_type TEXT NOT NULL CHECK (session_type IN ('focus', 'learning', 'coding', 'quiz', 'interview')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. ACTIVITY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. USER PROGRESS (XP and Streaks)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_activity_date DATE,
  level INTEGER DEFAULT 1 CHECK (level > 0),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. ROADMAPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  target_role TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. ROADMAP SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roadmap_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL CHECK (order_index >= 0),
  importance TEXT CHECK (importance IN ('essential', 'recommended', 'optional')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(roadmap_id, skill_id),
  UNIQUE(roadmap_id, order_index)
);

-- ============================================================
-- 14. QUIZZES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 15. QUIZ QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL CHECK (order_index >= 0),
  UNIQUE(quiz_id, order_index)
);

-- ============================================================
-- 16. QUIZ ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed);

-- Courses
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);

-- Lessons
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON lessons(course_id, order_index);

-- Lesson Progress
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson ON lesson_progress(user_id, lesson_id);

-- Coding Problems
CREATE INDEX IF NOT EXISTS idx_coding_problems_category ON coding_problems(category);
CREATE INDEX IF NOT EXISTS idx_coding_problems_difficulty ON coding_problems(difficulty);

-- Problem Progress
CREATE INDEX IF NOT EXISTS idx_problem_progress_user_id ON problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_progress_problem_id ON problem_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_problem_progress_status ON problem_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_problem_progress_solved ON problem_progress(user_id, solved_at);

-- Study Sessions
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON study_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_type ON study_sessions(user_id, session_type);
CREATE INDEX IF NOT EXISTS idx_study_sessions_completed ON study_sessions(user_id, completed);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON tasks(user_id, due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(user_id, priority);

-- Activity
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_type ON activity(user_id, activity_type);

-- User Progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Roadmaps
CREATE INDEX IF NOT EXISTS idx_roadmaps_target_role ON roadmaps(target_role);

-- Roadmap Skills
CREATE INDEX IF NOT EXISTS idx_roadmap_skills_roadmap_id ON roadmap_skills(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_skills_skill_id ON roadmap_skills(skill_id);

-- Quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes(category);
CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON quizzes(difficulty);

-- Quiz Questions
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- Quiz Attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(user_id, completed_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses (Public Read)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = TRUE);

-- Lessons (Public Read)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;
CREATE POLICY "Anyone can view lessons" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.is_published = TRUE
    )
  );

-- Lesson Progress (User-specific)
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own lesson progress" ON lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson progress" ON lesson_progress;
CREATE POLICY "Users can insert own lesson progress" ON lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lesson progress" ON lesson_progress;
CREATE POLICY "Users can update own lesson progress" ON lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own lesson progress" ON lesson_progress;
CREATE POLICY "Users can delete own lesson progress" ON lesson_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Coding Problems (Public Read)
ALTER TABLE coding_problems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view coding problems" ON coding_problems;
CREATE POLICY "Anyone can view coding problems" ON coding_problems
  FOR SELECT USING (TRUE);

-- Problem Progress (User-specific)
ALTER TABLE problem_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own problem progress" ON problem_progress;
CREATE POLICY "Users can view own problem progress" ON problem_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own problem progress" ON problem_progress;
CREATE POLICY "Users can insert own problem progress" ON problem_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own problem progress" ON problem_progress;
CREATE POLICY "Users can update own problem progress" ON problem_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own problem progress" ON problem_progress;
CREATE POLICY "Users can delete own problem progress" ON problem_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Study Sessions (User-specific)
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own study sessions" ON study_sessions;
CREATE POLICY "Users can view own study sessions" ON study_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own study sessions" ON study_sessions;
CREATE POLICY "Users can insert own study sessions" ON study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own study sessions" ON study_sessions;
CREATE POLICY "Users can update own study sessions" ON study_sessions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own study sessions" ON study_sessions;
CREATE POLICY "Users can delete own study sessions" ON study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Tasks (User-specific)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Activity (User-specific)
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activity" ON activity;
CREATE POLICY "Users can view own activity" ON activity
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity" ON activity;
CREATE POLICY "Users can insert own activity" ON activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Progress (User-specific)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Roadmaps (Public Read)
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view roadmaps" ON roadmaps;
CREATE POLICY "Anyone can view roadmaps" ON roadmaps
  FOR SELECT USING (TRUE);

-- Roadmap Skills (Public Read)
ALTER TABLE roadmap_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view roadmap skills" ON roadmap_skills;
CREATE POLICY "Anyone can view roadmap skills" ON roadmap_skills
  FOR SELECT USING (TRUE);

-- Quizzes (Public Read)
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view quizzes" ON quizzes;
CREATE POLICY "Anyone can view quizzes" ON quizzes
  FOR SELECT USING (TRUE);

-- Quiz Questions (Public Read)
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view quiz questions" ON quiz_questions;
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions
  FOR SELECT USING (TRUE);

-- Quiz Attempts (User-specific)
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON quiz_attempts;
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================

-- Profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Courses
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Lessons
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Lesson Progress
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Coding Problems
DROP TRIGGER IF EXISTS update_coding_problems_updated_at ON coding_problems;
CREATE TRIGGER update_coding_problems_updated_at
  BEFORE UPDATE ON coding_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Problem Progress
DROP TRIGGER IF EXISTS update_problem_progress_updated_at ON problem_progress;
CREATE TRIGGER update_problem_progress_updated_at
  BEFORE UPDATE ON problem_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- User Progress
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Roadmaps
DROP TRIGGER IF EXISTS update_roadmaps_updated_at ON roadmaps;
CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Quizzes
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- HELPER FUNCTION: Auto-create user_progress on profile creation
-- ============================================================
CREATE OR REPLACE FUNCTION create_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_progress();

-- ============================================================
-- END OF MIGRATION
-- ============================================================
