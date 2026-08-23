-- ============================================================
-- PLACIFY TRUST FOUNDATION - MINIMAL FRAMEWORK SEED DATA
-- ============================================================
-- This seed data represents Placify's INTERNAL COMPETENCY FRAMEWORK
-- It is NOT externally verified and must be marked as such
-- ============================================================

-- ============================================================
-- 1. SOURCES
-- Establish Placify Framework as a source
-- ============================================================

INSERT INTO sources (id, name, organization, source_type, description, verification_status) VALUES
('e0000001-0000-0000-0000-000000000001', 'Placify Competency Framework', 'Placify', 'placify_framework', 'Internal framework for skill requirements and levels. Not externally verified.', 'unverified')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. ROLE REQUIREMENTS
-- Minimal framework requirements for common target roles
-- Marked as "framework" - NOT externally verified
-- ============================================================

-- Machine Learning Engineer Requirements
INSERT INTO role_requirements (role_name, skill_name, required_level, importance, source_id, verification_status, notes) VALUES
('Machine Learning Engineer', 'Python', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Machine Learning Engineer', 'Statistics', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Machine Learning Engineer', 'Machine Learning', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Machine Learning Engineer', 'NumPy', 'intermediate', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Machine Learning Engineer', 'Pandas', 'intermediate', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Machine Learning Engineer', 'SQL', 'intermediate', 'recommended', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Machine Learning Engineer', 'Deep Learning', 'intermediate', 'recommended', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Machine Learning Engineer', 'Git', 'beginner', 'recommended', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified')
ON CONFLICT (role_name, skill_name) DO NOTHING;

-- Data Scientist Requirements
INSERT INTO role_requirements (role_name, skill_name, required_level, importance, source_id, verification_status, notes) VALUES
('Data Scientist', 'Python', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Data Scientist', 'Statistics', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Data Scientist', 'SQL', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Data Scientist', 'Pandas', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Data Scientist', 'NumPy', 'intermediate', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Data Scientist', 'Machine Learning', 'intermediate', 'recommended', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Data Scientist', 'Data Visualization', 'intermediate', 'recommended', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified')
ON CONFLICT (role_name, skill_name) DO NOTHING;

-- Software Engineer Requirements
INSERT INTO role_requirements (role_name, skill_name, required_level, importance, source_id, verification_status, notes) VALUES
('Software Engineer', 'Python', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Software Engineer', 'Data Structures', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Software Engineer', 'Algorithms', 'advanced', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Software Engineer', 'System Design', 'intermediate', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Software Engineer', 'Git', 'intermediate', 'essential', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified'),
('Software Engineer', 'SQL', 'intermediate', 'recommended', 'e0000001-0000-0000-0000-000000000001', 'framework', 'Placify framework requirement - not externally verified')
ON CONFLICT (role_name, skill_name) DO NOTHING;

-- ============================================================
-- IMPORTANT NOTES
-- ============================================================
-- 
-- 1. All requirements marked as verification_status = 'framework'
-- 2. Source clearly indicates Placify internal framework
-- 3. Notes explicitly state "not externally verified"
-- 4. Skills referenced by name (canonical), not by skill_id
-- 5. Skill names must match what users enter in their skills table
--
-- These are FRAMEWORK requirements only. As externally verified
-- requirements become available, they should be added with:
-- - verification_status = 'verified'
-- - Proper source_id pointing to verified source
-- - last_reviewed_at date
-- ============================================================

-- ============================================================
-- END OF TRUST FRAMEWORK SEED DATA
-- ============================================================
