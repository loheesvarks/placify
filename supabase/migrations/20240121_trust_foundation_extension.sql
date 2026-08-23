-- ============================================================
-- PLACIFY PHASE 2B: TRUST FOUNDATION EXTENSION
-- Evidence-based, transparent, source-backed placement guidance
-- ============================================================
-- This migration adds the trust infrastructure required for:
-- - Source provenance (where requirements come from)
-- - Role requirements (what skills target roles need)
-- - Skill evidence (separating claimed from demonstrated)
-- - Skill assessments (calculated mastery with confidence)
-- - Skill gaps (transparent gap analysis)
-- - Recommendations (auditable action suggestions with reasoning)
-- ============================================================

-- ============================================================
-- 1. SOURCES
-- Track provenance of career requirements and learning content
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organization TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN (
    'official_company',
    'official_documentation',
    'university',
    'industry_organization',
    'technical_source',
    'placify_framework'
  )),
  url TEXT,
  author TEXT,
  description TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN (
    'verified',
    'unverified',
    'disputed'
  )),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CRITICAL DESIGN NOTE:
-- The existing `skills` table is USER-SPECIFIC (user_id + skill_name).
-- Role/company requirements need CANONICAL skill references.
-- 
-- SOLUTION: Use skill_name TEXT with controlled values instead of skill_id.
-- This maintains compatibility with existing schema while supporting
-- the trust foundation's need for canonical skill references.
-- ============================================================

-- ============================================================
-- 2. ROLE REQUIREMENTS
-- What skills are required for target roles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.role_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT NOT NULL,
  skill_name TEXT NOT NULL,  -- Canonical skill name (e.g., "Python", "Machine Learning")
  required_level TEXT NOT NULL CHECK (required_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  importance TEXT NOT NULL CHECK (importance IN ('essential', 'recommended', 'optional')),
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  verification_status TEXT NOT NULL DEFAULT 'framework' CHECK (verification_status IN ('verified', 'framework', 'inferred')),
  notes TEXT,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_name, skill_name)
);

-- ============================================================
-- 3. COMPANY REQUIREMENTS  
-- Company-specific skill requirements (when available)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.company_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  role_name TEXT NOT NULL,
  skill_name TEXT NOT NULL,  -- Canonical skill name
  required_level TEXT NOT NULL CHECK (required_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  importance TEXT NOT NULL CHECK (importance IN ('essential', 'recommended', 'optional')),
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  verification_status TEXT NOT NULL DEFAULT 'inferred' CHECK (verification_status IN ('verified', 'inferred')),
  notes TEXT,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_name, role_name, skill_name)
);

-- ============================================================
-- 4. SKILL EVIDENCE
-- Historical record of student skill demonstrations
-- Separates CLAIMED from DEMONSTRATED
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skill_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,  -- References user's specific skill
  evidence_type TEXT NOT NULL CHECK (evidence_type IN (
    'self_reported',
    'lesson_completion',
    'quiz_score',
    'coding_problem',
    'project',
    'assessment',
    'interview'
  )),
  evidence_source_table TEXT,    -- e.g., "quiz_attempts", "problem_progress"
  evidence_source_id UUID,        -- FK to source record (polymorphic)
  skill_level_demonstrated TEXT CHECK (skill_level_demonstrated IN ('beginner', 'intermediate', 'advanced', 'expert')),
  score DECIMAL(5, 2) CHECK (score >= 0 AND score <= 100),  -- Normalized 0-100
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  weight DECIMAL(3, 2) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
  metadata JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. SKILL ASSESSMENTS
-- Current calculated state of user's skill mastery
-- Evidence-based with confidence tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skill_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,  -- References user's specific skill
  claimed_level INTEGER CHECK (claimed_level BETWEEN 1 AND 10),  -- From skills.proficiency_level
  demonstrated_level TEXT NOT NULL DEFAULT 'unknown' CHECK (demonstrated_level IN ('unknown', 'beginner', 'intermediate', 'advanced', 'expert')),
  confidence TEXT NOT NULL DEFAULT 'low' CHECK (confidence IN ('low', 'medium', 'high')),
  evidence_count INTEGER NOT NULL DEFAULT 0 CHECK (evidence_count >= 0),
  assessment_score_avg DECIMAL(5, 2) CHECK (assessment_score_avg >= 0 AND assessment_score_avg <= 100),
  practice_performance_avg DECIMAL(5, 2) CHECK (practice_performance_avg >= 0 AND practice_performance_avg <= 100),
  project_count INTEGER DEFAULT 0 CHECK (project_count >= 0),
  interview_performance DECIMAL(5, 2) CHECK (interview_performance >= 0 AND interview_performance <= 100),
  calculation_version TEXT NOT NULL DEFAULT 'v1.0',
  last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ============================================================
-- 6. SKILL GAPS
-- Calculated gaps between required and demonstrated levels
-- Transparent prioritization for learning recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,  -- References user's specific skill
  skill_name TEXT NOT NULL,  -- Denormalized for easier querying
  required_level TEXT NOT NULL CHECK (required_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  current_level TEXT NOT NULL CHECK (current_level IN ('unknown', 'beginner', 'intermediate', 'advanced', 'expert')),
  gap_size TEXT NOT NULL CHECK (gap_size IN ('none', 'small', 'medium', 'large')),
  importance TEXT NOT NULL CHECK (importance IN ('essential', 'recommended', 'optional')),
  priority_score DECIMAL(5, 2) NOT NULL CHECK (priority_score >= 0 AND priority_score <= 100),
  is_prerequisite BOOLEAN NOT NULL DEFAULT FALSE,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  confidence TEXT NOT NULL CHECK (confidence IN ('low', 'medium', 'high')),
  calculation_version TEXT NOT NULL DEFAULT 'v1.0',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ============================================================
-- 7. RECOMMENDATIONS
-- Auditable trail of what Placify recommends and why
-- Preserves reasoning, evidence, and context
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN (
    'next_action',
    'daily_plan',
    'skill_focus',
    'course_suggestion',
    'practice_suggestion'
  )),
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  target_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,  -- References user's specific skill
  target_skill_name TEXT,  -- Denormalized for easier querying
  expected_benefit TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  evidence_used JSONB DEFAULT '{}'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  calculation_version TEXT NOT NULL DEFAULT 'v1.0',
  accepted BOOLEAN,
  acted_upon_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Sources
CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(source_type);
CREATE INDEX IF NOT EXISTS idx_sources_verification ON sources(verification_status);

-- Role Requirements
CREATE INDEX IF NOT EXISTS idx_role_requirements_role ON role_requirements(role_name);
CREATE INDEX IF NOT EXISTS idx_role_requirements_skill ON role_requirements(skill_name);
CREATE INDEX IF NOT EXISTS idx_role_requirements_importance ON role_requirements(role_name, importance);

-- Company Requirements
CREATE INDEX IF NOT EXISTS idx_company_requirements_company ON company_requirements(company_name);
CREATE INDEX IF NOT EXISTS idx_company_requirements_role ON company_requirements(company_name, role_name);
CREATE INDEX IF NOT EXISTS idx_company_requirements_skill ON company_requirements(skill_name);

-- Skill Evidence
CREATE INDEX IF NOT EXISTS idx_skill_evidence_user ON skill_evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_skill ON skill_evidence(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_user_skill ON skill_evidence(user_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_type ON skill_evidence(user_id, evidence_type);
CREATE INDEX IF NOT EXISTS idx_skill_evidence_recorded ON skill_evidence(user_id, recorded_at DESC);

-- Skill Assessments
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user ON skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_skill ON skill_assessments(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_level ON skill_assessments(user_id, demonstrated_level);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_confidence ON skill_assessments(user_id, confidence);

-- Skill Gaps
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_skill ON skill_gaps(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_priority ON skill_gaps(user_id, priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_urgency ON skill_gaps(user_id, urgency);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_prerequisite ON skill_gaps(user_id, is_prerequisite);

-- Recommendations
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(user_id, recommendation_type);
CREATE INDEX IF NOT EXISTS idx_recommendations_created ON recommendations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_skill ON recommendations(target_skill_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_accepted ON recommendations(user_id, accepted);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Sources (Public Read)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view sources" ON sources;
CREATE POLICY "Anyone can view sources" ON sources
  FOR SELECT USING (TRUE);

-- Role Requirements (Public Read)
ALTER TABLE role_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view role requirements" ON role_requirements;
CREATE POLICY "Anyone can view role requirements" ON role_requirements
  FOR SELECT USING (TRUE);

-- Company Requirements (Public Read)
ALTER TABLE company_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view company requirements" ON company_requirements;
CREATE POLICY "Anyone can view company requirements" ON company_requirements
  FOR SELECT USING (TRUE);

-- Skill Evidence (User-specific)
ALTER TABLE skill_evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own skill evidence" ON skill_evidence;
CREATE POLICY "Users can view own skill evidence" ON skill_evidence
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own skill evidence" ON skill_evidence;
CREATE POLICY "Users can insert own skill evidence" ON skill_evidence
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Skill Assessments (User-specific)
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own skill assessments" ON skill_assessments;
CREATE POLICY "Users can view own skill assessments" ON skill_assessments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own skill assessments" ON skill_assessments;
CREATE POLICY "Users can insert own skill assessments" ON skill_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own skill assessments" ON skill_assessments;
CREATE POLICY "Users can update own skill assessments" ON skill_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Skill Gaps (User-specific)
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own skill gaps" ON skill_gaps;
CREATE POLICY "Users can view own skill gaps" ON skill_gaps
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own skill gaps" ON skill_gaps;
CREATE POLICY "Users can insert own skill gaps" ON skill_gaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own skill gaps" ON skill_gaps;
CREATE POLICY "Users can update own skill gaps" ON skill_gaps
  FOR UPDATE USING (auth.uid() = user_id);

-- Recommendations (User-specific)
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own recommendations" ON recommendations;
CREATE POLICY "Users can view own recommendations" ON recommendations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own recommendations" ON recommendations;
CREATE POLICY "Users can insert own recommendations" ON recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recommendations" ON recommendations;
CREATE POLICY "Users can update own recommendations" ON recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================

-- Sources
DROP TRIGGER IF EXISTS update_sources_updated_at ON sources;
CREATE TRIGGER update_sources_updated_at
  BEFORE UPDATE ON sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Role Requirements
DROP TRIGGER IF EXISTS update_role_requirements_updated_at ON role_requirements;
CREATE TRIGGER update_role_requirements_updated_at
  BEFORE UPDATE ON role_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Company Requirements
DROP TRIGGER IF EXISTS update_company_requirements_updated_at ON company_requirements;
CREATE TRIGGER update_company_requirements_updated_at
  BEFORE UPDATE ON company_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Skill Assessments
DROP TRIGGER IF EXISTS update_skill_assessments_updated_at ON skill_assessments;
CREATE TRIGGER update_skill_assessments_updated_at
  BEFORE UPDATE ON skill_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- END OF PHASE 2B MIGRATION
-- ============================================================
