# Technical Design Document

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Next.js 14+ App (React 18+, TypeScript)                   │ │
│  │  - Server Components (RSC)                                  │ │
│  │  - Client Components (Interactive UI)                       │ │
│  │  - Server Actions (Mutations)                               │ │
│  │  - API Routes (Complex Operations)                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services Layer                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │   Supabase       │  │   OpenAI API     │  │   Vercel Edge │ │
│  │  - PostgreSQL    │  │  - GPT-4 Turbo   │  │   Functions   │ │
│  │  - Auth          │  │  - Embeddings    │  │               │ │
│  │  - Real-time     │  │  - Completions   │  │               │ │
│  │  - Storage       │  │                  │  │               │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database (Supabase)                             │ │
│  │  - User Data                                                │ │
│  │  - Roadmap Data                                             │ │
│  │  - Analytics Data                                           │ │
│  │  - Content Data                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Frontend Architecture

```
Next.js App Router Structure:
app/
├── (auth)/                    # Auth layout group
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── verify-email/
├── (dashboard)/               # Protected dashboard layout
│   ├── dashboard/
│   ├── roadmap/
│   ├── mentor/
│   ├── interview/
│   ├── resume/
│   ├── planner/
│   ├── analytics/
│   ├── companies/
│   ├── projects/
│   └── settings/
├── (onboarding)/              # Onboarding flow
│   └── onboarding/
├── api/                       # API routes
│   ├── ai/
│   ├── webhooks/
│   └── cron/
└── layout.tsx                 # Root layout
```

**Key Architectural Decisions:**

- Server Components for initial data loading (improved performance)
- Client Components for interactive features (roadmap, charts)
- Server Actions for mutations (simplified data flow)
- Parallel routes for modals and intercepting routes
- Route groups for shared layouts

### 1.3 Authentication Flow

```
User Action → Supabase Auth → JWT Token → Row-Level Security → Data Access

Flow Diagram:
1. User submits credentials
2. Next.js Server Action calls Supabase Auth
3. Supabase validates credentials
4. Returns JWT token + user data
5. Token stored in httpOnly cookie
6. Middleware validates token on protected routes
7. RLS policies enforce data access control
```

**Implementation Details:**

- Supabase Auth handles OAuth (Google, GitHub) and email/password
- Middleware checks auth status for protected routes
- Server Actions verify authentication before mutations
- Client-side auth state managed via Zustand
- Auto-refresh for expired tokens

### 1.4 AI Integration Architecture

```
User Request → Next.js API/Server Action → OpenAI API → Response Processing → Database → UI Update

Components:
1. AI Mentor Chat: Streaming GPT-4 responses
2. Resume Analyzer: Document parsing + GPT-4 analysis
3. Mock Interview: Dynamic question generation + evaluation
4. Project Generator: Structured project ideas generation
5. Roadmap Generator: Complex multi-step generation
6. Weekly Review: Analytics aggregation + insights
```

## 2. Database Schema

### 2.1 Core Tables

#### users (managed by Supabase Auth)

```sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### profiles

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light')),
  notification_preferences JSONB DEFAULT '{"email": true, "inApp": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### target_profiles

```sql
CREATE TABLE public.target_profiles (
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

CREATE INDEX idx_target_profiles_user_id ON target_profiles(user_id);

-- RLS Policies
ALTER TABLE target_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own target profile" ON target_profiles FOR ALL USING (auth.uid() = user_id);
```

#### skills

```sql
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 10),
  category TEXT, -- 'technical', 'soft', 'domain'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

CREATE INDEX idx_skills_user_id ON skills(user_id);

-- RLS Policies
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own skills" ON skills FOR ALL USING (auth.uid() = user_id);
```

#### roadmaps

```sql
CREATE TABLE public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_profile_id UUID REFERENCES target_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  total_nodes INTEGER DEFAULT 0,
  completed_nodes INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5, 2) DEFAULT 0,
  layout_data JSONB, -- Custom node positions for React Flow
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_profile_id)
);

CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_roadmaps_status ON roadmaps(status);

-- RLS Policies
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own roadmaps" ON roadmaps FOR ALL USING (auth.uid() = user_id);
```

#### roadmap_nodes

```sql
CREATE TABLE public.roadmap_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL, -- For React Flow
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Detailed learning content
  node_type TEXT DEFAULT 'learning' CHECK (node_type IN ('learning', 'project', 'assessment', 'milestone')),
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  estimated_hours DECIMAL(5, 2),
  actual_hours DECIMAL(5, 2),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  required_skills TEXT[],
  resources JSONB DEFAULT '[]'::jsonb, -- [{type, title, url}]
  dependencies TEXT[], -- Array of node_ids
  position_x DECIMAL(10, 2),
  position_y DECIMAL(10, 2),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(roadmap_id, node_id)
);

CREATE INDEX idx_roadmap_nodes_roadmap_id ON roadmap_nodes(roadmap_id);
CREATE INDEX idx_roadmap_nodes_status ON roadmap_nodes(status);

-- RLS Policies
ALTER TABLE roadmap_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roadmap nodes" ON roadmap_nodes FOR SELECT
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_nodes.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can update own roadmap nodes" ON roadmap_nodes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_nodes.roadmap_id AND roadmaps.user_id = auth.uid()));
```

#### companies

```sql
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  company_size TEXT,
  description TEXT,
  tech_stack TEXT[],
  interview_process JSONB, -- Structured interview stages
  common_questions JSONB DEFAULT '[]'::jsonb,
  coding_patterns JSONB DEFAULT '[]'::jsonb,
  culture_info TEXT,
  salary_range JSONB,
  benefits TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_name ON companies(name);

-- Public read access, admin write
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view companies" ON companies FOR SELECT USING (true);
```

#### resumes

```sql
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  parsed_content TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- RLS Policies
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own resumes" ON resumes FOR ALL USING (auth.uid() = user_id);
```

#### resume_analyses

```sql
CREATE TABLE public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  missing_keywords TEXT[],
  recommendations JSONB DEFAULT '[]'::jsonb,
  formatting_score INTEGER,
  content_score INTEGER,
  keyword_score INTEGER,
  detailed_feedback TEXT,
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX idx_resume_analyses_resume_id ON resume_analyses(resume_id);

-- RLS Policies
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analyses" ON resume_analyses FOR SELECT USING (auth.uid() = user_id);
```

#### mock_interviews

```sql
CREATE TABLE public.mock_interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('technical', 'behavioral', 'hr')),
  target_role TEXT,
  target_company TEXT,
  duration_minutes INTEGER,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  feedback TEXT,
  strengths TEXT[],
  areas_for_improvement TEXT[],
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mock_interviews_user_id ON mock_interviews(user_id);
CREATE INDEX idx_mock_interviews_status ON mock_interviews(status);

-- RLS Policies
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own interviews" ON mock_interviews FOR ALL USING (auth.uid() = user_id);
```

#### interview_exchanges

```sql
CREATE TABLE public.interview_exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES mock_interviews(id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  question_type TEXT,
  difficulty TEXT,
  evaluation_score INTEGER CHECK (evaluation_score BETWEEN 0 AND 100),
  evaluation_feedback TEXT,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interview_exchanges_interview_id ON interview_exchanges(interview_id);

-- RLS Policies
ALTER TABLE interview_exchanges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own exchanges" ON interview_exchanges FOR SELECT
  USING (EXISTS (SELECT 1 FROM mock_interviews WHERE mock_interviews.id = interview_exchanges.interview_id AND mock_interviews.user_id = auth.uid()));
```

#### daily_tasks

```sql
CREATE TABLE public.daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  duration_minutes INTEGER,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  roadmap_node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX idx_daily_tasks_scheduled_date ON daily_tasks(scheduled_date);
CREATE INDEX idx_daily_tasks_status ON daily_tasks(status);

-- RLS Policies
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tasks" ON daily_tasks FOR ALL USING (auth.uid() = user_id);
```

#### weekly_reviews

```sql
CREATE TABLE public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_study_hours DECIMAL(5, 2),
  nodes_completed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  tasks_total INTEGER DEFAULT 0,
  completion_rate DECIMAL(5, 2),
  progress_percentage DECIMAL(5, 2),
  week_over_week_change DECIMAL(5, 2),
  top_strengths TEXT[],
  areas_for_improvement TEXT[],
  recommendations TEXT[],
  timeline_adjustment_needed BOOLEAN DEFAULT FALSE,
  estimated_completion_date DATE,
  ai_insights TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weekly_reviews_user_id ON weekly_reviews(user_id);
CREATE INDEX idx_weekly_reviews_week_start ON weekly_reviews(week_start_date);
CREATE UNIQUE INDEX idx_weekly_reviews_unique ON weekly_reviews(user_id, week_start_date);

-- RLS Policies
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reviews" ON weekly_reviews FOR SELECT USING (auth.uid() = user_id);
```

#### projects

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_hours INTEGER,
  technologies TEXT[],
  requirements TEXT[],
  implementation_phases JSONB DEFAULT '[]'::jsonb,
  evaluation_criteria JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'in_progress', 'completed', 'dismissed')),
  roadmap_node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
  github_url TEXT,
  demo_url TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
```

#### study_sessions

```sql
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap_node_id UUID REFERENCES roadmap_nodes(id) ON DELETE SET NULL,
  daily_task_id UUID REFERENCES daily_tasks(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL,
  session_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON study_sessions(session_date);

-- RLS Policies
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);
```

#### notifications

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('milestone', 'reminder', 'review', 'achievement', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
```

#### ai_conversations

```sql
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_type TEXT DEFAULT 'mentor' CHECK (conversation_type IN ('mentor', 'interview', 'support')),
  title TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);

-- RLS Policies
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own conversations" ON ai_conversations FOR ALL USING (auth.uid() = user_id);
```

#### ai_messages

```sql
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);

-- RLS Policies
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON ai_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.user_id = auth.uid()));
```

#### analytics_events

```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- RLS Policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own events" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 2.2 Database Functions and Triggers

#### Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_target_profiles_updated_at BEFORE UPDATE ON target_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- (Apply to other tables with updated_at column)
```

#### Update roadmap completion

```sql
CREATE OR REPLACE FUNCTION update_roadmap_completion()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE roadmaps
  SET
    completed_nodes = (
      SELECT COUNT(*) FROM roadmap_nodes
      WHERE roadmap_id = NEW.roadmap_id AND status = 'completed'
    ),
    completion_percentage = (
      SELECT (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100)
      FROM roadmap_nodes
      WHERE roadmap_id = NEW.roadmap_id
    )
  WHERE id = NEW.roadmap_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roadmap_on_node_change
  AFTER INSERT OR UPDATE OF status ON roadmap_nodes
  FOR EACH ROW EXECUTE FUNCTION update_roadmap_completion();
```

#### Create profile on user signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 3. Data Models and TypeScript Interfaces

### 3.1 Core Type Definitions

```typescript
// lib/types/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      target_profiles: {
        Row: TargetProfile;
        Insert: TargetProfileInsert;
        Update: TargetProfileUpdate;
      };
      roadmaps: {
        Row: Roadmap;
        Insert: RoadmapInsert;
        Update: RoadmapUpdate;
      };
      roadmap_nodes: {
        Row: RoadmapNode;
        Insert: RoadmapNodeInsert;
        Update: RoadmapNodeUpdate;
      };
      // ... other tables
    };
  };
}
```

### 3.2 Domain Models

```typescript
// lib/types/models.ts

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
  theme_preference: 'dark' | 'light';
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  reminders: boolean;
  weeklyReview: boolean;
  milestones: boolean;
}

export interface TargetProfile {
  id: string;
  user_id: string;
  target_role: string;
  target_package_min: number;
  target_package_max: number;
  currency: string;
  target_companies: string[];
  available_hours_per_day: number;
  timeline_weeks: number;
  start_date: string;
  expected_end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  skill_name: string;
  proficiency_level: number;
  category: 'technical' | 'soft' | 'domain';
  created_at: string;
  updated_at: string;
}
```

export interface Roadmap {
id: string
user_id: string
target_profile_id: string
title: string
description: string | null
status: RoadmapStatus
total_nodes: number
completed_nodes: number
completion_percentage: number
layout_data: ReactFlowLayoutData | null
created_at: string
updated_at: string
}

export type RoadmapStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface ReactFlowLayoutData {
nodes: Array<{ id: string; position: { x: number; y: number } }>
viewport?: { x: number; y: number; zoom: number }
}

export interface RoadmapNode {
id: string
roadmap_id: string
node_id: string
title: string
description: string | null
content: string | null
node_type: NodeType
status: NodeStatus
estimated_hours: number
actual_hours: number | null
difficulty_level: DifficultyLevel
required_skills: string[]
resources: Resource[]
dependencies: string[]
position_x: number
position_y: number
started_at: string | null
completed_at: string | null
created_at: string
updated_at: string
}

export type NodeType = 'learning' | 'project' | 'assessment' | 'milestone'
export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Resource {
type: 'article' | 'video' | 'course' | 'documentation' | 'book'
title: string
url: string
duration?: string
}

```

export interface MockInterview {
  id: string
  user_id: string
  interview_type: InterviewType
  target_role: string | null
  target_company: string | null
  duration_minutes: number | null
  status: InterviewStatus
  overall_score: number | null
  feedback: string | null
  strengths: string[]
  areas_for_improvement: string[]
  started_at: string
  completed_at: string | null
  created_at: string
}

export type InterviewType = 'technical' | 'behavioral' | 'hr'
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned'

export interface InterviewExchange {
  id: string
  interview_id: string
  sequence_number: number
  question: string
  answer: string | null
  question_type: string | null
  difficulty: string | null
  evaluation_score: number | null
  evaluation_feedback: string | null
  time_taken_seconds: number | null
  created_at: string
}

export interface Resume {
  id: string
  user_id: string
  filename: string
  file_url: string
  file_size: number
  file_type: string
  parsed_content: string | null
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface ResumeAnalysis {
  id: string
  resume_id: string
  user_id: string
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  missing_keywords: string[]
  recommendations: Recommendation[]
  formatting_score: number
  content_score: number
  keyword_score: number
  detailed_feedback: string
  ai_model: string
  created_at: string
}

export interface Recommendation {
  category: string
  issue: string
  suggestion: string
  example?: string
  priority: 'low' | 'medium' | 'high'
}
```

export interface DailyTask {
id: string
user_id: string
title: string
description: string | null
scheduled_date: string
scheduled_time: string | null
duration_minutes: number | null
priority: TaskPriority
status: TaskStatus
roadmap_node_id: string | null
completed_at: string | null
created_at: string
updated_at: string
}

export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface WeeklyReview {
id: string
user_id: string
week_start_date: string
week_end_date: string
total_study_hours: number
nodes_completed: number
tasks_completed: number
tasks_total: number
completion_rate: number
progress_percentage: number
week_over_week_change: number
top_strengths: string[]
areas_for_improvement: string[]
recommendations: string[]
timeline_adjustment_needed: boolean
estimated_completion_date: string | null
ai_insights: string
created_at: string
}

export interface Project {
id: string
user_id: string
title: string
description: string | null
difficulty_level: DifficultyLevel
estimated_duration_hours: number | null
technologies: string[]
requirements: string[]
implementation_phases: ProjectPhase[]
evaluation_criteria: EvaluationCriterion[]
status: ProjectStatus
roadmap_node_id: string | null
github_url: string | null
demo_url: string | null
started_at: string | null
completed_at: string | null
created_at: string
updated_at: string
}

export type ProjectStatus = 'suggested' | 'in_progress' | 'completed' | 'dismissed'

export interface ProjectPhase {
phase_number: number
title: string
description: string
tasks: string[]
estimated_hours: number
}

export interface EvaluationCriterion {
criterion: string
description: string
weight: number
}

```

export interface Company {
  id: string
  name: string
  logo_url: string | null
  website: string | null
  industry: string | null
  company_size: string | null
  description: string | null
  tech_stack: string[]
  interview_process: InterviewProcess
  common_questions: CommonQuestion[]
  coding_patterns: CodingPattern[]
  culture_info: string | null
  salary_range: SalaryRange | null
  benefits: string[]
  created_at: string
  updated_at: string
}

export interface InterviewProcess {
  stages: InterviewStage[]
  typical_duration: string
  notes?: string
}

export interface InterviewStage {
  stage_number: number
  name: string
  type: string
  duration: string
  description: string
}

export interface CommonQuestion {
  question: string
  type: 'technical' | 'behavioral' | 'hr'
  difficulty: DifficultyLevel
  topic?: string
}

export interface CodingPattern {
  pattern_name: string
  description: string
  frequency: 'high' | 'medium' | 'low'
  example_problems: string[]
}

export interface SalaryRange {
  min: number
  max: number
  currency: string
  level: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  action_url: string | null
  is_read: boolean
  priority: 'low' | 'normal' | 'high'
  metadata: Json | null
  created_at: string
}

export type NotificationType = 'milestone' | 'reminder' | 'review' | 'achievement' | 'system'

export interface AIConversation {
  id: string
  user_id: string
  conversation_type: ConversationType
  title: string | null
  last_message_at: string
  created_at: string
}

export type ConversationType = 'mentor' | 'interview' | 'support'

export interface AIMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: Json | null
  created_at: string
}
```

### 3.3 Validation Schemas (Zod)

```typescript
// lib/validations/schemas.ts
import { z } from 'zod';

export const targetProfileSchema = z
  .object({
    target_role: z.string().min(1, 'Target role is required'),
    target_package_min: z.number().positive('Minimum package must be positive'),
    target_package_max: z.number().positive('Maximum package must be positive'),
    currency: z.string().default('USD'),
    target_companies: z.array(z.string()).min(1, 'Select at least one company'),
    available_hours_per_day: z.number().min(1).max(24),
    timeline_weeks: z.number().min(1).max(52),
  })
  .refine((data) => data.target_package_max >= data.target_package_min, {
    message: 'Maximum package must be greater than or equal to minimum package',
    path: ['target_package_max'],
  });

export const skillSchema = z.object({
  skill_name: z.string().min(1, 'Skill name is required'),
  proficiency_level: z.number().min(1).max(10),
  category: z.enum(['technical', 'soft', 'domain']),
});

export const dailyTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduled_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  duration_minutes: z.number().min(5).max(480).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  roadmap_node_id: z.string().uuid().optional(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(100),
  theme_preference: z.enum(['dark', 'light']),
  notification_preferences: z.object({
    email: z.boolean(),
    inApp: z.boolean(),
    reminders: z.boolean(),
    weeklyReview: z.boolean(),
    milestones: z.boolean(),
  }),
});
```

## 4. Component Architecture

### 4.1 Component Hierarchy

```
App
├── Providers
│   ├── AuthProvider (Zustand)
│   ├── ThemeProvider
│   └── QueryProvider (if using React Query)
├── Layouts
│   ├── RootLayout
│   ├── AuthLayout
│   │   ├── AuthHeader
│   │   └── AuthFooter
│   └── DashboardLayout
│       ├── Sidebar
│       ├── TopBar
│       │   ├── SearchBar
│       │   ├── NotificationBell
│       │   └── UserMenu
│       └── Content
├── Pages (App Router)
│   ├── (auth)
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   ├── ForgotPasswordPage
│   │   └── VerifyEmailPage
│   ├── (onboarding)
│   │   └── OnboardingWizard
│   │       ├── WelcomeStep
│   │       ├── TargetProfileStep
│   │       ├── SkillsStep
│   │       └── PreferencesStep
│   └── (dashboard)
│       ├── DashboardPage
│       │   ├── StatsOverview
│       │   ├── UpcomingTasks
│       │   ├── RecentActivity
│       │   └── QuickActions
│       ├── RoadmapPage
│       │   ├── RoadmapCanvas (React Flow)
│       │   ├── RoadmapControls
│       │   ├── NodeDetailsModal
│       │   └── ProgressSidebar
│       ├── MentorPage
│       │   ├── ChatInterface
│       │   ├── MessageList
│       │   ├── MessageInput
│       │   └── SuggestedPrompts
│       ├── InterviewPage
│       │   ├── InterviewSetup
│       │   ├── ActiveInterview
│       │   ├── InterviewHistory
│       │   └── PerformanceMetrics
│       ├── ResumePage
│       │   ├── ResumeUploader
│       │   ├── ResumeViewer
│       │   ├── AnalysisResults
│       │   └── ImprovementSuggestions
│       ├── PlannerPage
│       │   ├── Calendar
│       │   ├── TaskList
│       │   ├── TaskForm
│       │   └── DailyStats
│       ├── AnalyticsPage
│       │   ├── MetricsGrid
│       │   ├── ProgressChart
│       │   ├── SkillsRadar
│       │   └── ActivityHeatmap
│       ├── CompaniesPage
│       │   ├── CompanyList
│       │   ├── CompanyCard
│       │   ├── CompanyDetails
│       │   └── PreparationResources
│       ├── ProjectsPage
│       │   ├── ProjectGenerator
│       │   ├── ProjectList
│       │   ├── ProjectCard
│       │   └── ProjectDetails
│       └── SettingsPage
│           ├── ProfileSettings
│           ├── AccountSettings
│           ├── NotificationSettings
│           └── DataExport
└── Shared Components (UI Library)
    ├── Button
    ├── Input
    ├── Card
    ├── Modal
    ├── Toast
    ├── Badge
    ├── Avatar
    ├── Skeleton
    ├── Progress
    ├── Tabs
    ├── Dropdown
    └── ... (other primitives)
```

### 4.2 Key Component Specifications

#### Button Component

```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Features:**

- Framer Motion animations on hover/press
- Soft glow effect matching design system
- Loading state with spinner
- Icon support
- Accessible (keyboard navigation, ARIA labels)

#### Card Component

```typescript
// components/ui/card.tsx
interface CardProps {
  variant?: 'default' | 'glass' | 'outlined';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
```

**Features:**

- Glass morphism effect with backdrop blur
- Hover animations
- Border gradients (blue/purple)
- Responsive padding

#### Modal Component

```typescript
// components/ui/modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}
```

**Features:**

- AnimatePresence for smooth enter/exit
- Backdrop blur
- Focus trap
- ESC key to close
- Portal rendering
- Scroll lock

#### RoadmapCanvas Component

```typescript
// components/roadmap/roadmap-canvas.tsx
interface RoadmapCanvasProps {
  roadmapId: string;
  nodes: RoadmapNode[];
  onNodeClick: (node: RoadmapNode) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<RoadmapNode>) => void;
  onLayoutChange: (layout: ReactFlowLayoutData) => void;
}
```

**Features:**

- React Flow integration
- Custom node types for different node_type values
- Status-based styling (locked, available, in_progress, completed)
- Dependency edges with animations
- Minimap and controls
- Auto-layout algorithm
- Zoom and pan
- Touch gestures for mobile

**Node Styling:**

- Locked: Grayscale, no glow
- Available: Blue glow, clickable
- In Progress: Purple glow, pulsing animation
- Completed: Green checkmark, success glow

#### ChatInterface Component

```typescript
// components/mentor/chat-interface.tsx
interface ChatInterfaceProps {
  conversationId: string;
  messages: AIMessage[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
}
```

**Features:**

- Streaming AI responses
- Markdown rendering for formatted responses
- Code syntax highlighting
- Auto-scroll to bottom
- Message timestamps
- Copy message content
- Regenerate response

## 5. Folder Structure

```
placify/
├── .kiro/
│   └── specs/
│       └── placify/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── verify-email/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── roadmap/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── mentor/
│   │   │   ├── page.tsx
│   │   │   └── [conversationId]/
│   │   │       └── page.tsx
│   │   ├── interview/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── resume/
│   │   │   └── page.tsx
│   │   ├── planner/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── companies/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (onboarding)/
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   ├── resume-analysis/
│   │   │   │   └── route.ts
│   │   │   ├── roadmap-generation/
│   │   │   │   └── route.ts
│   │   │   ├── project-generation/
│   │   │   │   └── route.ts
│   │   │   └── weekly-review/
│   │   │       └── route.ts
│   │   ├── webhooks/
│   │   │   └── supabase/
│   │   │       └── route.ts
│   │   └── cron/
│   │       └── weekly-reviews/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── toast.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── dropdown.tsx
│   │   ├── tooltip.tsx
│   │   └── index.ts
│   ├── layouts/
│   │   ├── root-layout.tsx
│   │   ├── auth-layout.tsx
│   │   ├── dashboard-layout.tsx
│   │   ├── sidebar.tsx
│   │   └── top-bar.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── oauth-buttons.tsx
│   ├── onboarding/
│   │   ├── onboarding-wizard.tsx
│   │   ├── welcome-step.tsx
│   │   ├── target-profile-step.tsx
│   │   ├── skills-step.tsx
│   │   └── preferences-step.tsx
│   ├── dashboard/
│   │   ├── stats-overview.tsx
│   │   ├── upcoming-tasks.tsx
│   │   ├── recent-activity.tsx
│   │   └── quick-actions.tsx
│   ├── roadmap/
│   │   ├── roadmap-canvas.tsx
│   │   ├── custom-node.tsx
│   │   ├── node-details-modal.tsx
│   │   ├── progress-sidebar.tsx
│   │   └── roadmap-controls.tsx
│   ├── mentor/
│   │   ├── chat-interface.tsx
│   │   ├── message-list.tsx
│   │   ├── message-bubble.tsx
│   │   ├── message-input.tsx
│   │   └── suggested-prompts.tsx
│   ├── interview/
│   │   ├── interview-setup.tsx
│   │   ├── active-interview.tsx
│   │   ├── interview-history.tsx
│   │   └── performance-metrics.tsx
│   ├── resume/
│   │   ├── resume-uploader.tsx
│   │   ├── resume-viewer.tsx
│   │   ├── analysis-results.tsx
│   │   └── improvement-suggestions.tsx
│   ├── planner/
│   │   ├── calendar.tsx
│   │   ├── task-list.tsx
│   │   ├── task-card.tsx
│   │   ├── task-form.tsx
│   │   └── daily-stats.tsx
│   ├── analytics/
│   │   ├── metrics-grid.tsx
│   │   ├── progress-chart.tsx
│   │   ├── skills-radar.tsx
│   │   └── activity-heatmap.tsx
│   ├── companies/
│   │   ├── company-list.tsx
│   │   ├── company-card.tsx
│   │   ├── company-details.tsx
│   │   └── preparation-resources.tsx
│   ├── projects/
│   │   ├── project-generator.tsx
│   │   ├── project-list.tsx
│   │   ├── project-card.tsx
│   │   └── project-details.tsx
│   ├── settings/
│   │   ├── profile-settings.tsx
│   │   ├── account-settings.tsx
│   │   ├── notification-settings.tsx
│   │   └── data-export.tsx
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       ├── error-boundary.tsx
│       ├── page-header.tsx
│       └── search-bar.tsx
```

├── lib/
│ ├── supabase/
│ │ ├── client.ts
│ │ ├── server.ts
│ │ ├── middleware.ts
│ │ └── types.ts
│ ├── openai/
│ │ ├── client.ts
│ │ ├── chat.ts
│ │ ├── analysis.ts
│ │ └── generation.ts
│ ├── actions/
│ │ ├── auth.actions.ts
│ │ ├── profile.actions.ts
│ │ ├── roadmap.actions.ts
│ │ ├── tasks.actions.ts
│ │ ├── interview.actions.ts
│ │ ├── resume.actions.ts
│ │ └── analytics.actions.ts
│ ├── hooks/
│ │ ├── use-auth.ts
│ │ ├── use-roadmap.ts
│ │ ├── use-tasks.ts
│ │ ├── use-notifications.ts
│ │ ├── use-realtime.ts
│ │ └── use-media-query.ts
│ ├── stores/
│ │ ├── auth.store.ts
│ │ ├── user.store.ts
│ │ ├── roadmap.store.ts
│ │ ├── planner.store.ts
│ │ └── notifications.store.ts
│ ├── utils/
│ │ ├── cn.ts
│ │ ├── date.ts
│ │ ├── format.ts
│ │ ├── validation.ts
│ │ └── api.ts
│ ├── types/
│ │ ├── database.types.ts
│ │ ├── models.ts
│ │ ├── api.ts
│ │ └── index.ts
│ └── validations/
│ ├── schemas.ts
│ └── rules.ts
├── public/
│ ├── images/
│ ├── icons/
│ └── fonts/
├── styles/
│ └── animations.css
├── supabase/
│ ├── migrations/
│ │ ├── 001_initial_schema.sql
│ │ ├── 002_rls_policies.sql
│ │ └── 003_functions_triggers.sql
│ └── seed.sql
├── .env.local
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md

````

## 6. State Management

### 6.1 Zustand Store Architecture

#### Auth Store
```typescript
// lib/stores/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false
      }),

      setSession: (session) => set({ session }),

      signOut: async () => {
        // Sign out logic
        set({ user: null, session: null, isAuthenticated: false })
      },

      refreshSession: async () => {
        // Refresh session logic
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session
      })
    }
  )
)
````

#### Roadmap Store

```typescript
// lib/stores/roadmap.store.ts
import { create } from 'zustand';

interface RoadmapState {
  currentRoadmap: Roadmap | null;
  nodes: RoadmapNode[];
  selectedNode: RoadmapNode | null;
  isLoading: boolean;

  // Actions
  setRoadmap: (roadmap: Roadmap) => void;
  setNodes: (nodes: RoadmapNode[]) => void;
  selectNode: (node: RoadmapNode | null) => void;
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  addNode: (node: RoadmapNode) => void;
  removeNode: (nodeId: string) => void;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  currentRoadmap: null,
  nodes: [],
  selectedNode: null,
  isLoading: false,

  setRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),

  setNodes: (nodes) => set({ nodes }),

  selectNode: (node) => set({ selectedNode: node }),

  updateNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.node_id === nodeId ? { ...node, status } : node)),
    })),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.node_id !== nodeId),
    })),
}));
```

#### Notifications Store

```typescript
// lib/stores/notifications.store.ts
import { create } from 'zustand';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.is_read ? state.unreadCount : state.unreadCount + 1,
    })),

  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),

  removeNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    })),
}));
```

### 6.2 Server State Management

**Strategy:** Combine Zustand for UI state with Server Components for data fetching

- Server Components fetch initial data (no client-side waterfalls)
- Server Actions for mutations with optimistic updates
- Real-time subscriptions via Supabase for live updates
- Zustand stores hold transient UI state (modals, selections, filters)

## 7. API Architecture

### 7.1 Server Actions (Primary Mutation Pattern)

```typescript
// lib/actions/roadmap.actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateNodeStatus(
  nodeId: string,
  status: NodeStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update node
    const { error } = await supabase
      .from('roadmap_nodes')
      .update({
        status,
        ...(status === 'in_progress' && { started_at: new Date().toISOString() }),
        ...(status === 'completed' && { completed_at: new Date().toISOString() }),
      })
      .eq('id', nodeId);

    if (error) throw error;

    // Revalidate the roadmap page
    revalidatePath('/dashboard/roadmap');

    return { success: true };
  } catch (error) {
    console.error('Update node status error:', error);
    return { success: false, error: 'Failed to update node status' };
  }
}

export async function createDailyTask(
  data: DailyTaskInput
): Promise<{ success: boolean; task?: DailyTask; error?: string }> {
  try {
    const supabase = createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate with Zod
    const validated = dailyTaskSchema.parse(data);

    const { data: task, error } = await supabase
      .from('daily_tasks')
      .insert({ ...validated, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/planner');

    return { success: true, task };
  } catch (error) {
    console.error('Create task error:', error);
    return { success: false, error: 'Failed to create task' };
  }
}
```

### 7.2 API Routes (For Complex Operations)

#### AI Chat Stream

```typescript
// app/api/ai/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { openai } from '@/lib/openai/client';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get user context (target profile, current progress)
    const { data: targetProfile } = await supabase
      .from('target_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Create system prompt with context
    const systemPrompt = `You are an AI career mentor helping ${user.email} prepare for ${targetProfile?.target_role}...`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const stream = OpenAIStream(response, {
      onCompletion: async (completion) => {
        // Save message to database
        await supabase.from('ai_messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: completion,
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

#### Resume Analysis

```typescript
// app/api/ai/resume-analysis/route.ts
import { openai } from '@/lib/openai/client';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { resumeId, resumeContent } = await req.json();

    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get target profile for context
    const { data: targetProfile } = await supabase
      .from('target_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const prompt = `Analyze this resume for a ${targetProfile?.target_role} position at companies like ${targetProfile?.target_companies.join(', ')}.
    
Resume Content:
${resumeContent}

Provide a comprehensive analysis with:
1. Overall score (0-100)
2. Strengths (list of 3-5)
3. Weaknesses (list of 3-5)
4. Missing keywords
5. Specific recommendations with examples
6. Formatting score
7. Content score
8. Keyword score

Respond in JSON format.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');

    // Save analysis to database
    const { data: savedAnalysis } = await supabase
      .from('resume_analyses')
      .insert({
        resume_id: resumeId,
        user_id: user.id,
        overall_score: analysis.overall_score,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missing_keywords: analysis.missing_keywords,
        recommendations: analysis.recommendations,
        formatting_score: analysis.formatting_score,
        content_score: analysis.content_score,
        keyword_score: analysis.keyword_score,
        detailed_feedback: analysis.detailed_feedback,
        ai_model: 'gpt-4-turbo-preview',
      })
      .select()
      .single();

    return Response.json({ success: true, analysis: savedAnalysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
```

### 7.3 Real-time Subscriptions

```typescript
// lib/hooks/use-realtime.ts
import { useEffect } from 'use';
import { createBrowserClient } from '@/lib/supabase/client';
import { useNotificationsStore } from '@/lib/stores/notifications.store';

export function useRealtimeNotifications(userId: string) {
  const { addNotification } = useNotificationsStore();

  useEffect(() => {
    const supabase = createBrowserClient();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          addNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, addNotification]);
}

export function useRealtimeRoadmapUpdates(roadmapId: string) {
  const { setNodes } = useRoadmapStore();

  useEffect(() => {
    const supabase = createBrowserClient();

    const channel = supabase
      .channel('roadmap-nodes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'roadmap_nodes',
          filter: `roadmap_id=eq.${roadmapId}`,
        },
        async () => {
          // Refetch nodes
          const { data } = await supabase
            .from('roadmap_nodes')
            .select('*')
            .eq('roadmap_id', roadmapId);

          if (data) setNodes(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roadmapId, setNodes]);
}
```

## 8. Design System Implementation

### 8.1 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow-md': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
        'glow-purple-sm': '0 0 10px rgba(168, 85, 247, 0.3)',
        'glow-purple-md': '0 0 20px rgba(168, 85, 247, 0.4)',
        'glow-purple-lg': '0 0 30px rgba(168, 85, 247, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
```

### 8.2 Global CSS Variables

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 11%;
    --foreground: 213 31% 91%;

    --border: 216 34% 17%;
    --input: 216 34% 17%;

    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 11%;

    --secondary: 271 91% 65%;
    --secondary-foreground: 222 47% 11%;

    --radius: 0.5rem;

    --font-inter: 'Inter', system-ui, sans-serif;
    --font-jetbrains: 'JetBrains Mono', monospace;
  }

  .light {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    --border: 214 32% 91%;
    --input: 214 32% 91%;

    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;

    --secondary: 271 91% 65%;
    --secondary-foreground: 0 0% 100%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      'rlig' 1,
      'calt' 1;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    @apply w-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-glass rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-glass-light;
  }
}

@layer components {
  .glass-card {
    @apply bg-glass backdrop-blur-md border border-white/10 rounded-lg;
  }

  .glass-card-hover {
    @apply glass-card transition-all duration-300 hover:bg-glass-light hover:shadow-glow-md;
  }

  .gradient-text {
    @apply bg-gradient-primary bg-clip-text text-transparent;
  }

  .btn-glow {
    @apply shadow-glow-sm hover:shadow-glow-md transition-shadow duration-300;
  }
}
```

### 8.3 Framer Motion Variants

```typescript
// lib/animations/variants.ts
import { Variants } from 'framer-motion';

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

export const glowVariants: Variants = {
  initial: { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
  hover: {
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
    transition: { duration: 0.3 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};
```

## 9. User Flows

### 9.1 Onboarding Flow

```
1. User Registration
   ├── Email/Password OR OAuth (Google/GitHub)
   ├── Email Verification (if email/password)
   └── Redirect to Onboarding

2. Onboarding Wizard
   Step 1: Welcome
   ├── Brief introduction to Placify
   ├── "Get Started" button
   └── Progress indicator (1/4)

   Step 2: Target Profile
   ├── Input target role (autocomplete suggestions)
   ├── Select target package range (min/max, currency selector)
   ├── Select target companies (multi-select with search)
   ├── Set available study hours per day (slider)
   ├── Set timeline in weeks (slider)
   └── Progress indicator (2/4)

   Step 3: Current Skills
   ├── Add skills with proficiency levels (1-10)
   ├── Skill suggestions based on target role
   ├── Category tags (technical/soft/domain)
   └── Progress indicator (3/4)

   Step 4: Preferences
   ├── Theme selection (dark/light)
   ├── Notification preferences
   ├── Email digest frequency
   └── Progress indicator (4/4)

3. Roadmap Generation
   ├── Loading state (animated progress bar)
   ├── AI generates personalized roadmap (10-15 seconds)
   ├── Success animation
   └── Redirect to Dashboard with roadmap preview

4. Interactive Tutorial (Optional)
   ├── Tooltips highlighting key features
   ├── "Skip Tour" option available
   └── Mark onboarding as completed
```

### 9.2 Roadmap Interaction Flow

```
1. View Roadmap
   ├── Load roadmap from database
   ├── Render React Flow canvas
   ├── Display all nodes with status colors
   └── Show progress sidebar

2. Explore Node
   ├── Click on node
   ├── Modal opens with node details
   ├── Display: title, description, content, resources, dependencies
   ├── Show estimated vs actual hours
   └── Display status and actions

3. Start Node
   ├── User clicks "Start Learning" button
   ├── Check dependencies are completed
   ├── Update status to "in_progress"
   ├── Record start timestamp
   ├── Update UI optimistically
   └── Show success toast

4. Complete Node
   ├── User clicks "Mark as Complete" button
   ├── Confirmation dialog (optional assessment)
   ├── Update status to "completed"
   ├── Record completion timestamp and actual hours
   ├── Unlock dependent nodes
   ├── Update roadmap completion percentage
   ├── Check for milestone achievement
   └── Show celebration animation

5. Update Layout
   ├── User drags nodes to reposition
   ├── Save layout data to database
   ├── Persist viewport (zoom/pan)
   └── Sync across devices
```

### 9.3 Mock Interview Flow

```
1. Interview Setup
   ├── Select interview type (technical/behavioral/hr)
   ├── Select target company (optional)
   ├── Set duration (15-60 minutes)
   └── Click "Start Interview"

2. Interview Session
   ├── AI generates first question based on type and role
   ├── Display question with timer
   ├── User types answer
   ├── Submit answer
   ├── AI evaluates response and generates next question
   ├── Repeat until time expires or user ends session
   └── Track sequence, timestamps, and responses

3. Interview Completion
   ├── AI generates comprehensive feedback (10 seconds)
   ├── Calculate overall score and individual scores
   ├── Identify strengths and areas for improvement
   └── Save interview record to database

4. View Results
   ├── Display overall score with visual gauge
   ├── Show question-by-question breakdown
   ├── Display detailed feedback for each answer
   ├── Show comparison with previous interviews
   └── Provide actionable recommendations

5. Interview History
   ├── List all past interviews
   ├── Filter by type, company, date range
   ├── View trends over time (chart)
   └── Replay interview (view questions/answers)
```

### 9.4 Resume Analysis Flow

```
1. Upload Resume
   ├── Drag & drop or file picker
   ├── Validate file type (PDF, DOCX, TXT)
   ├── Validate file size (max 5MB)
   ├── Upload to Supabase Storage
   └── Extract text content

2. Analysis Process
   ├── Show loading state with progress indicators
   ├── Send resume content + target profile to AI
   ├── AI analyzes (5-10 seconds)
   └── Save analysis results to database

3. Display Results
   ├── Overall score with animated circular progress
   ├── Score breakdown (formatting, content, keywords)
   ├── Strengths list with icons
   ├── Weaknesses list with icons
   ├── Missing keywords with importance indicators
   └── Detailed recommendations with examples

4. Act on Feedback
   ├── View side-by-side: original vs suggestions
   ├── Copy individual suggestions
   ├── Export report as PDF
   └── Upload revised resume for comparison

5. Resume History
   ├── List all analyzed resumes
   ├── Compare scores across versions
   ├── Track improvements over time
   └── Set primary resume
```

### 9.5 Daily Planner Flow

```
1. View Daily Tasks
   ├── Display tasks for selected date
   ├── Group by priority (high/medium/low)
   ├── Show completion status
   └── Display total planned hours vs available hours

2. Create Task
   ├── Click "Add Task" button
   ├── Fill form: title, description, time, duration, priority
   ├── Optionally link to roadmap node
   ├── Validate total hours don't exceed available hours
   ├── Save to database
   └── Update UI optimistically

3. Manage Tasks
   ├── Drag to reorder tasks
   ├── Click to edit task details
   ├── Toggle task status (pending → in_progress → completed)
   ├── Delete task with confirmation
   └── Reschedule to different date

4. Task Suggestions
   ├── AI suggests tasks based on current roadmap nodes
   ├── Display suggestions in separate section
   ├── One-click add to schedule
   └── Customize before adding

5. Daily Stats
   ├── Display tasks completed / total
   ├── Show hours logged / hours planned
   ├── Display current streak
   └── Show progress chart
```

## 10. Security Implementation

### 10.1 Authentication Security

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/roadmap',
    '/mentor',
    '/interview',
    '/resume',
    '/planner',
    '/analytics',
    '/companies',
    '/projects',
    '/settings',
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check onboarding completion
  if (user && !isAuthRoute && request.nextUrl.pathname !== '/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

### 10.2 Input Validation and Sanitization

```typescript
// lib/utils/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

/**
 * Sanitize user input for database storage
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

/**
 * Validate and sanitize file upload
 */
export async function validateFileUpload(
  file: File,
  options: {
    maxSize: number;
    allowedTypes: string[];
  }
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${options.maxSize / 1024 / 1024}MB limit`,
    };
  }

  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Additional validation for images
  if (file.type.startsWith('image/')) {
    try {
      const bitmap = await createImageBitmap(file);
      bitmap.close();
    } catch {
      return { valid: false, error: 'Invalid image file' };
    }
  }

  return { valid: true };
}

/**
 * Rate limiting check
 */
export function checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
  // Implementation with Redis or in-memory store
  // Returns true if within limit, false if exceeded
  return true;
}
```

### 10.3 API Security

```typescript
// lib/utils/api-security.ts

/**
 * Verify request authenticity (CSRF protection)
 */
export function verifyCsrfToken(headerToken: string | null, cookieToken: string | null): boolean {
  if (!headerToken || !cookieToken) return false;
  return headerToken === cookieToken;
}

/**
 * Rate limit API endpoints
 */
export async function rateLimit(
  request: Request,
  options: { maxRequests: number; windowMs: number }
): Promise<{ success: boolean; remaining: number }> {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // Implementation would use Redis or Vercel KV
  // For now, returning success
  return { success: true, remaining: options.maxRequests };
}

/**
 * Validate API key for external integrations
 */
export function validateApiKey(key: string | null): boolean {
  if (!key) return false;
  // Compare with hashed keys in database
  return true;
}

/**
 * Audit log for sensitive operations
 */
export async function auditLog(data: {
  userId: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
}) {
  // Log to database or external service
  console.log('AUDIT:', data);
}
```

### 10.4 Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_ORGANIZATION_ID=your_openai_org_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Email Service (Optional)
RESEND_API_KEY=your_resend_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn
VERCEL_ANALYTICS_ID=your_analytics_id

# Rate Limiting (Optional - for production)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

## 11. Performance Optimization

### 11.1 Code Splitting Strategy

```typescript
// app/(dashboard)/roadmap/page.tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load heavy components
const RoadmapCanvas = dynamic(
  () => import('@/components/roadmap/roadmap-canvas'),
  {
    ssr: false,
    loading: () => <RoadmapSkeleton />
  }
)

const ProgressSidebar = dynamic(
  () => import('@/components/roadmap/progress-sidebar'),
  {
    loading: () => <SidebarSkeleton />
  }
)

export default async function RoadmapPage() {
  // Server-side data fetching
  const roadmap = await getRoadmap()

  return (
    <div className="h-screen flex">
      <Suspense fallback={<RoadmapSkeleton />}>
        <RoadmapCanvas initialData={roadmap} />
      </Suspense>

      <Suspense fallback={<SidebarSkeleton />}>
        <ProgressSidebar roadmapId={roadmap.id} />
      </Suspense>
    </div>
  )
}
```

### 11.2 Image Optimization

```typescript
// components/ui/optimized-image.tsx
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### 11.3 Database Query Optimization

```sql
-- Create indexes for frequently queried columns

-- Roadmap nodes queries
CREATE INDEX idx_roadmap_nodes_roadmap_status ON roadmap_nodes(roadmap_id, status);
CREATE INDEX idx_roadmap_nodes_user_lookup ON roadmap_nodes(roadmap_id)
  INCLUDE (status, title, node_type);

-- Daily tasks queries
CREATE INDEX idx_daily_tasks_user_date ON daily_tasks(user_id, scheduled_date)
  WHERE status != 'cancelled';
CREATE INDEX idx_daily_tasks_status_date ON daily_tasks(status, scheduled_date);

-- Notifications queries
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Analytics queries
CREATE INDEX idx_study_sessions_user_date ON study_sessions(user_id, session_date DESC);
CREATE INDEX idx_mock_interviews_user_date ON mock_interviews(user_id, started_at DESC);

-- Composite index for common joins
CREATE INDEX idx_roadmap_nodes_dependencies ON roadmap_nodes
  USING GIN (dependencies);
```

### 11.4 Caching Strategy

```typescript
// lib/cache/redis-cache.ts (Optional - for production)
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5 minutes default
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get<T>(key);

  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  await redis.set(key, data, { ex: ttl });

  return data;
}

export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Usage example
export async function getCompanies() {
  return getCachedData(
    'companies:all',
    async () => {
      const supabase = createServerClient();
      const { data } = await supabase.from('companies').select('*');
      return data || [];
    },
    3600 // Cache for 1 hour
  );
}
```

## 12. Accessibility Implementation

### 12.1 Keyboard Navigation

```typescript
// components/ui/keyboard-navigation.tsx
import { useEffect } from 'react';

export function useKeyboardNavigation(items: any[], onSelect: (index: number) => void) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;

        case 'Enter':
          if (focusedIndex >= 0) {
            e.preventDefault();
            onSelect(focusedIndex);
          }
          break;

        case 'Escape':
          setFocusedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, items.length, onSelect]);

  return { focusedIndex, setFocusedIndex };
}
```

### 12.2 ARIA Labels and Roles

```typescript
// components/roadmap/roadmap-canvas.tsx
export function RoadmapCanvas({ nodes }: RoadmapCanvasProps) {
  return (
    <div
      role="application"
      aria-label="Interactive learning roadmap"
      aria-describedby="roadmap-instructions"
    >
      <div id="roadmap-instructions" className="sr-only">
        Use arrow keys to navigate between nodes.
        Press Enter to view node details.
        Press Tab to move to controls.
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        aria-label="Roadmap visualization"
      >
        {nodes.map(node => (
          <CustomNode
            key={node.id}
            data={node}
            aria-label={`${node.title}, ${node.status}`}
            aria-describedby={`node-${node.id}-description`}
            role="button"
            tabIndex={0}
          />
        ))}
      </ReactFlow>
    </div>
  )
}
```

### 12.3 Focus Management

```typescript
// components/ui/modal.tsx
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Focus close button when modal opens
      closeButtonRef.current?.focus()

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Modal Content */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative glass-card p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="modal-title" className="text-2xl font-semibold">
                  {title}
                </h2>

                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="p-2 hover:bg-glass-light rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>{children}</div>
            </motion.div>
          </div>
        </FocusTrap>
      )}
    </AnimatePresence>
  )
}
```

### 12.4 Screen Reader Support

```typescript
// components/ui/visually-hidden.tsx
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Usage in components
<button onClick={handleClick} aria-label="Mark task as complete">
  <CheckIcon aria-hidden="true" />
  <VisuallyHidden>Mark task as complete</VisuallyHidden>
</button>
```

## 13. Testing Strategy

### 13.1 Unit Testing (Jest + React Testing Library)

```typescript
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('applies correct variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-gradient-primary')
  })
})
```

### 13.2 Integration Testing

```typescript
// __tests__/integration/roadmap.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RoadmapPage } from '@/app/(dashboard)/roadmap/page'

// Mock Supabase
jest.mock('@/lib/supabase/client')

describe('Roadmap Integration', () => {
  it('loads and displays roadmap nodes', async () => {
    render(<RoadmapPage />)

    await waitFor(() => {
      expect(screen.getByText('Learn JavaScript Basics')).toBeInTheDocument()
      expect(screen.getByText('Build First Project')).toBeInTheDocument()
    })
  })

  it('opens node details modal on click', async () => {
    const user = userEvent.setup()
    render(<RoadmapPage />)

    await waitFor(() => {
      expect(screen.getByText('Learn JavaScript Basics')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Learn JavaScript Basics'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Node Details')).toBeInTheDocument()
  })

  it('updates node status optimistically', async () => {
    const user = userEvent.setup()
    render(<RoadmapPage />)

    await user.click(screen.getByLabelText('Mark as complete'))

    // UI updates immediately (optimistic)
    expect(screen.getByTestId('node-status')).toHaveTextContent('completed')
  })
})
```

### 13.3 E2E Testing (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register and complete onboarding', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Test123456!');
    await page.fill('[name="confirmPassword"]', 'Test123456!');
    await page.click('button[type="submit"]');

    // Should redirect to onboarding
    await expect(page).toHaveURL('/onboarding');

    // Complete onboarding steps
    await page.click('text=Get Started');

    // Step 1: Target Profile
    await page.fill('[name="targetRole"]', 'Frontend Developer');
    await page.fill('[name="minPackage"]', '80000');
    await page.fill('[name="maxPackage"]', '120000');
    await page.click('text=Next');

    // Step 2: Skills
    await page.fill('[name="skillName"]', 'JavaScript');
    await page.click('[aria-label="Proficiency level 8"]');
    await page.click('text=Add Skill');
    await page.click('text=Next');

    // Step 3: Preferences
    await page.click('text=Dark Theme');
    await page.click('text=Complete');

    // Should redirect to dashboard with generated roadmap
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Your Learning Roadmap')).toBeVisible();
  });

  test('user can login and logout', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'existing@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=Sign Out');

    await expect(page).toHaveURL('/login');
  });
});
```

### 13.4 Accessibility Testing

```typescript
// __tests__/accessibility/a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@/components/ui/button'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  it('Button has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Modal has proper ARIA attributes', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}}>
        Content
      </Modal>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## 14. Deployment and DevOps

### 14.1 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "OPENAI_API_KEY": "@openai-api-key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### 14.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:ci
        env:
          CI: true

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    needs: lint-and-test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 14.3 Monitoring and Error Tracking

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Performance monitoring
  tracesSampleRate: 1.0,

  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.token;
    }
    return event;
  },

  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
});

// Custom error boundary
export function logError(error: Error, errorInfo?: React.ErrorInfo) {
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo?.componentStack,
      },
    },
  });
}
```

### 14.4 Package.json Scripts

```json
{
  "name": "placify",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:generate-types": "supabase gen types typescript --local > lib/types/database.types.ts",
    "db:migration": "supabase migration new",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset",
    "prepare": "husky install"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/ssr": "^0.3.0",
    "openai": "^4.47.0",
    "ai": "^3.1.0",
    "zustand": "^4.5.0",
    "zod": "^3.23.0",
    "framer-motion": "^11.2.0",
    "reactflow": "^11.11.0",
    "recharts": "^2.12.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.379.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.43.0",
    "jest-axe": "^8.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

## 15. Development Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Project setup and configuration
- [ ] Supabase project setup and database schema
- [ ] Authentication system implementation
- [ ] Design system and UI component library
- [ ] Base layouts and routing structure

### Phase 2: Core Features (Weeks 3-5)

- [ ] Onboarding flow
- [ ] Target profile configuration
- [ ] AI roadmap generation
- [ ] Interactive roadmap visualization (React Flow)
- [ ] Basic roadmap interactions (view, update status)

### Phase 3: AI Features (Weeks 6-7)

- [ ] AI Mentor chat interface
- [ ] OpenAI integration and streaming
- [ ] Resume upload and parsing
- [ ] Resume analysis with AI
- [ ] Mock interview system

### Phase 4: Planning & Analytics (Weeks 8-9)

- [ ] Daily planner with task management
- [ ] Study session tracking
- [ ] Weekly AI review generation
- [ ] Analytics dashboard with charts (Recharts)
- [ ] Progress tracking and metrics

### Phase 5: Content & Discovery (Week 10)

- [ ] Company preparation module
- [ ] Company data and resources
- [ ] Project generator
- [ ] Search functionality
- [ ] Notification system

### Phase 6: Polish & Optimization (Week 11)

- [ ] Responsive design refinements
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Error handling and edge cases
- [ ] Loading states and animations

### Phase 7: Testing & Deployment (Week 12)

- [ ] Unit test coverage (80%+)
- [ ] Integration tests
- [ ] E2E tests for critical flows
- [ ] Accessibility testing
- [ ] Performance audits (Lighthouse)
- [ ] Production deployment to Vercel
- [ ] Monitoring and error tracking setup

### Phase 8: Post-Launch (Ongoing)

- [ ] User feedback collection
- [ ] Bug fixes and improvements
- [ ] Feature enhancements
- [ ] Content updates (companies, resources)
- [ ] Performance monitoring and optimization

## 16. Key Technical Decisions Summary

### 16.1 Architecture Decisions

| Decision         | Choice                   | Rationale                                                            |
| ---------------- | ------------------------ | -------------------------------------------------------------------- |
| Framework        | Next.js 14+ (App Router) | Server Components, streaming, built-in optimizations, excellent DX   |
| Backend          | Supabase                 | Managed PostgreSQL, built-in auth, real-time subscriptions, RLS      |
| AI Provider      | OpenAI (GPT-4)           | Best-in-class language models, streaming support, reliable API       |
| State Management | Zustand                  | Lightweight, simple API, excellent TypeScript support                |
| Styling          | Tailwind CSS             | Utility-first, consistent design tokens, great performance           |
| Animation        | Framer Motion            | Declarative animations, gesture support, excellent React integration |
| Roadmap Viz      | React Flow               | Interactive node graphs, customizable, performant                    |
| Charts           | Recharts                 | React-native charts, composable, good customization                  |
| Validation       | Zod                      | TypeScript-first, runtime validation, excellent DX                   |
| Forms            | React Hook Form          | Performant, minimal re-renders, great validation integration         |

### 16.2 Design Principles

1. **Premium First**: Every interaction should feel polished and intentional
2. **Performance Matters**: Sub-2-second page loads, instant interactions
3. **Accessibility by Default**: WCAG 2.1 AA compliance from the start
4. **Mobile Responsive**: Full feature parity across all devices
5. **AI-Powered**: Leverage AI to reduce friction and add intelligence
6. **Data Security**: Encryption, RLS, input validation at every layer
7. **Scalable Architecture**: Stateless design, horizontal scaling ready
8. **Developer Experience**: Type-safe, well-documented, maintainable code

### 16.3 Success Metrics

**Performance:**

- Lighthouse score: 90+ (desktop), 80+ (mobile)
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
- Core Web Vitals: All "Good"

**Quality:**

- Test coverage: 80%+
- Zero critical accessibility violations
- TypeScript strict mode with no `any`
- ESLint zero warnings

**User Experience:**

- Onboarding completion rate: > 80%
- Daily active user retention: > 40%
- Feature adoption: > 60% use 3+ features
- User satisfaction (NPS): > 50

---

## Document Version

- **Version**: 1.0
- **Last Updated**: 2026-07-17
- **Status**: Ready for Implementation
