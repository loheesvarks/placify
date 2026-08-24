-- ============================================================
-- PLACIFY - PHASE 4B: PROJECT / PORTFOLIO INTELLIGENCE
-- Migration: Add Projects System
-- ============================================================
-- This migration creates the foundation for project-based evidence:
-- - Projects table (user-scoped)
-- - Project-skill associations
-- - Project technologies
-- - RLS policies for secure access
-- ============================================================
-- IMPORTANT: Projects feed into the existing skill_evidence system
-- Projects are NOT automatic proof of mastery
-- Evidence strength depends on what the student provides
-- ============================================================

-- ============================================================
-- 1. PROJECTS TABLE
-- ============================================================
-- Core project information
-- Each project belongs to one user
-- Projects can be in various states (planning, in_progress, completed, archived)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic information
  title TEXT NOT NULL CHECK (LENGTH(TRIM(title)) > 0),
  description TEXT,
  
  -- Project status
  status TEXT NOT NULL DEFAULT 'planning' 
    CHECK (status IN ('planning', 'in_progress', 'completed', 'archived')),
  
  -- Contribution details
  contribution_role TEXT, -- e.g., "Full Stack Developer", "Solo Project", "Team Lead"
  team_size INTEGER CHECK (team_size > 0),
  
  -- External links (treated as untrusted input)
  repository_url TEXT,
  demo_url TEXT,
  
  -- Measurable outcomes (student-provided, not fabricated)
  outcomes TEXT, -- Free-form description of results
  
  -- Timeline
  start_date DATE,
  completion_date DATE,
  
  -- Visibility
  is_public BOOLEAN DEFAULT FALSE, -- For future portfolio sharing
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CHECK (completion_date IS NULL OR start_date IS NULL OR completion_date >= start_date)
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_user_status ON public.projects(user_id, status);

-- ============================================================
-- 2. PROJECT_SKILLS TABLE
-- ============================================================
-- Junction table linking projects to skills
-- Allows students to explicitly associate skills with their projects
-- This is the PRIMARY way project evidence is generated
CREATE TABLE IF NOT EXISTS public.project_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  
  -- Evidence metadata
  -- skill_level_demonstrated: student's assessment of how they used this skill
  -- This feeds into skill_evidence but is NOT automatically accepted as truth
  skill_level_demonstrated TEXT 
    CHECK (skill_level_demonstrated IN ('beginner', 'intermediate', 'advanced', 'expert')),
  
  -- Notes about how this skill was used in the project
  usage_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique project-skill pairs
  UNIQUE(project_id, skill_id)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON public.project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill_id ON public.project_skills(skill_id);

-- ============================================================
-- 3. PROJECT_TECHNOLOGIES TABLE
-- ============================================================
-- Technologies/tools used in the project
-- Separate from skills for flexibility
-- A technology might not have a corresponding skill record
CREATE TABLE IF NOT EXISTS public.project_technologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Technology name (e.g., "React", "PostgreSQL", "Docker", "AWS Lambda")
  technology_name TEXT NOT NULL CHECK (LENGTH(TRIM(technology_name)) > 0),
  
  -- Category for grouping (optional)
  category TEXT, -- e.g., "Frontend", "Backend", "Database", "DevOps", "Cloud"
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate technologies per project
  UNIQUE(project_id, technology_name)
);

-- Create index for project lookups
CREATE INDEX IF NOT EXISTS idx_project_technologies_project_id ON public.project_technologies(project_id);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
-- CRITICAL: All project data must be user-scoped
-- Users can only access their own projects
-- No cross-user data leakage

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROJECTS TABLE POLICIES
-- ============================================================

-- Policy: Users can view their own projects
CREATE POLICY "Users can view own projects"
ON public.projects
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can create own projects"
ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update own projects"
ON public.projects
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own projects
-- NOTE: This will cascade to project_skills and project_technologies
-- Evidence records in skill_evidence table are preserved (immutable by design)
CREATE POLICY "Users can delete own projects"
ON public.projects
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- PROJECT_SKILLS TABLE POLICIES
-- ============================================================

-- Policy: Users can view project skills for their own projects
CREATE POLICY "Users can view own project skills"
ON public.project_skills
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_skills.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can add skills to their own projects
CREATE POLICY "Users can add skills to own projects"
ON public.project_skills
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_skills.project_id
    AND projects.user_id = auth.uid()
  )
  AND
  EXISTS (
    SELECT 1 FROM public.skills
    WHERE skills.id = project_skills.skill_id
    AND skills.user_id = auth.uid()
  )
);

-- Policy: Users can update skills on their own projects
CREATE POLICY "Users can update own project skills"
ON public.project_skills
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_skills.project_id
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_skills.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can remove skills from their own projects
CREATE POLICY "Users can delete own project skills"
ON public.project_skills
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_skills.project_id
    AND projects.user_id = auth.uid()
  )
);

-- ============================================================
-- PROJECT_TECHNOLOGIES TABLE POLICIES
-- ============================================================

-- Policy: Users can view technologies for their own projects
CREATE POLICY "Users can view own project technologies"
ON public.project_technologies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_technologies.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can add technologies to their own projects
CREATE POLICY "Users can add technologies to own projects"
ON public.project_technologies
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_technologies.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can update technologies on their own projects
CREATE POLICY "Users can update own project technologies"
ON public.project_technologies
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_technologies.project_id
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_technologies.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can remove technologies from their own projects
CREATE POLICY "Users can delete own project technologies"
ON public.project_technologies
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_technologies.project_id
    AND projects.user_id = auth.uid()
  )
);

-- ============================================================
-- 5. TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================

-- Trigger: Update projects.updated_at on modification
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================

COMMENT ON TABLE public.projects IS 
'User projects for portfolio and skill evidence. Projects feed into skill_evidence system but are NOT automatic proof of mastery.';

COMMENT ON TABLE public.project_skills IS 
'Junction table linking projects to skills. Explicitly defines which skills were demonstrated in a project.';

COMMENT ON TABLE public.project_technologies IS 
'Technologies and tools used in projects. Separate from skills for flexibility.';

COMMENT ON COLUMN public.projects.status IS 
'Project lifecycle: planning (not started), in_progress (active work), completed (finished), archived (historical)';

COMMENT ON COLUMN public.projects.outcomes IS 
'Measurable outcomes provided by student (e.g., "Reduced load time by 40%", "Deployed to 100 users"). NOT fabricated by system.';

COMMENT ON COLUMN public.project_skills.skill_level_demonstrated IS 
'Student assessment of skill proficiency demonstrated in this project. Feeds into evidence but is validated by assessment engine.';

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
-- Phase 4B foundation is ready:
-- ✓ Projects table with user isolation
-- ✓ Project-skill associations
-- ✓ Project technologies
-- ✓ RLS policies for security
-- ✓ Indexes for performance
-- 
-- Next steps (application layer):
-- - Create project service
-- - Create project actions
-- - Integrate with skill_evidence service
-- - Build project UI
-- ============================================================
