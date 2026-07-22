# Implementation Tasks

## Phase 1: Project Foundation

### Task 1.1: Initialize Next.js Project

**ID**: PLAC-001  
**Complexity**: Low  
**Dependencies**: None

**Description**:
Set up a new Next.js 14 project with TypeScript, configure essential build tools, and establish the base project structure.

**Acceptance Criteria**:

- Next.js 14+ project initialized with App Router
- TypeScript configured with strict mode enabled
- ESLint and Prettier configured
- Git repository initialized with .gitignore
- Project successfully builds and runs in development mode

**Files Created**:

- `package.json`
- `tsconfig.json`
- `.eslintrc.json`
- `.prettierrc`
- `next.config.js`
- `.gitignore`
- `app/layout.tsx`
- `app/page.tsx`

---

### Task 1.2: Configure Tailwind CSS and Design System

**ID**: PLAC-002  
**Complexity**: Medium  
**Dependencies**: PLAC-001

**Description**:
Install and configure Tailwind CSS with custom design tokens matching the dark futuristic glass UI aesthetic. Set up color palette with blue/purple gradients, typography system, spacing, and custom utilities.

**Acceptance Criteria**:

- Tailwind CSS installed and configured
- Custom color palette defined (primary blue, secondary purple, glass effects)
- Typography system configured with Inter font
- Custom animations defined (fade-in, slide-in, pulse-glow, shimmer)
- Global CSS variables set up for theming
- Box shadows for glow effects configured
- Glass morphism utilities created

**Files Created/Modified**:

- `tailwind.config.ts`
- `app/globals.css`
- `postcss.config.js`

---

### Task 1.3: Install and Configure Core Dependencies

**ID**: PLAC-003  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Install all essential dependencies including Framer Motion, Zustand, Zod, React Hook Form, date utilities, and icon library.

**Acceptance Criteria**:

- Framer Motion installed and working
- Zustand installed for state management
- Zod installed for validation
- React Hook Form installed
- date-fns installed
- Lucide React icons installed
- clsx and tailwind-merge installed for className utilities
- All dependencies compatible and no conflicts

**Files Modified**:

- `package.json`

---

### Task 1.4: Set Up Folder Structure

**ID**: PLAC-004  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Create the complete folder structure following the design specification, including app routes, components, lib utilities, and configuration directories.

**Acceptance Criteria**:

- All top-level directories created (app, components, lib, public, styles)
- App route groups created ((auth), (dashboard), (onboarding))
- Component directories organized by feature
- Lib directories created (supabase, openai, actions, hooks, stores, utils, types, validations)
- Public assets directories created
- Structure matches design document exactly

**Folders Created**:

- `app/(auth)/`, `app/(dashboard)/`, `app/(onboarding)/`, `app/api/`
- `components/ui/`, `components/layouts/`, `components/auth/`, etc.
- `lib/supabase/`, `lib/openai/`, `lib/actions/`, `lib/hooks/`, `lib/stores/`, `lib/utils/`, `lib/types/`, `lib/validations/`
- `public/images/`, `public/icons/`, `public/fonts/`
- `styles/`

---

### Task 1.5: Create Base UI Components

**ID**: PLAC-005  
**Complexity**: Medium  
**Dependencies**: PLAC-002, PLAC-003

**Description**:
Build foundational UI components (Button, Input, Card, Badge, Avatar, Skeleton) with Tailwind styling, Framer Motion animations, and accessibility features.

**Acceptance Criteria**:

- Button component with variants (primary, secondary, ghost, danger)
- Button supports loading state, icons, sizes (sm, md, lg)
- Input component with label, error states, and validation
- Card component with glass morphism effect and hover states
- Badge component for status indicators
- Avatar component with fallback
- Skeleton component for loading states
- All components are keyboard accessible
- All components have proper TypeScript types

**Files Created**:

- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/avatar.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/index.ts`

---

### Task 1.6: Create Modal and Toast Components

**ID**: PLAC-006  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build Modal component with focus trap, backdrop blur, and animations. Create Toast notification system with different variants.

**Acceptance Criteria**:

- Modal component with AnimatePresence
- Modal supports sizes (sm, md, lg, xl, full)
- Focus trap implemented
- ESC key closes modal
- Click outside closes modal (optional)
- Toast provider and useToast hook created
- Toast variants (success, error, warning, info)
- Toast auto-dismiss with configurable duration
- Toast stacking and queue management

**Files Created**:

- `components/ui/modal.tsx`
- `components/ui/toast.tsx`
- `components/ui/toast-provider.tsx`
- `lib/hooks/use-toast.ts`

---

### Task 1.7: Create Additional UI Components

**ID**: PLAC-007  
**Complexity**: Low  
**Dependencies**: PLAC-005

**Description**:
Build remaining UI primitives including Progress, Tabs, Dropdown, Tooltip, and utility components.

**Acceptance Criteria**:

- Progress bar with percentage display
- Tabs component with keyboard navigation
- Dropdown menu with positioning
- Tooltip component with hover/focus triggers
- VisuallyHidden component for screen readers
- All components accessible (ARIA attributes)
- Consistent styling with design system

**Files Created**:

- `components/ui/progress.tsx`
- `components/ui/tabs.tsx`
- `components/ui/dropdown.tsx`
- `components/ui/tooltip.tsx`
- `components/ui/visually-hidden.tsx`

---

### Task 1.8: Set Up Framer Motion Animation Variants

**ID**: PLAC-008  
**Complexity**: Low  
**Dependencies**: PLAC-003

**Description**:
Create reusable Framer Motion animation variants for consistent animations across the application.

**Acceptance Criteria**:

- fadeInVariants defined
- slideUpVariants defined
- scaleVariants defined
- staggerContainerVariants and staggerItemVariants defined
- modalVariants defined
- glowVariants defined
- All variants typed with TypeScript
- Variants follow design timing specifications

**Files Created**:

- `lib/animations/variants.ts`

---

### Task 1.9: Create Utility Functions

**ID**: PLAC-009  
**Complexity**: Low  
**Dependencies**: PLAC-003

**Description**:
Implement utility functions for className merging, date formatting, input validation, and common operations.

**Acceptance Criteria**:

- cn() function for className merging (clsx + tailwind-merge)
- Date formatting utilities (formatDate, formatRelativeTime, etc.)
- String formatting utilities (truncate, capitalize, etc.)
- Number formatting utilities (formatCurrency, formatPercentage)
- Input sanitization utilities
- All utilities have TypeScript types
- All utilities have JSDoc comments

**Files Created**:

- `lib/utils/cn.ts`
- `lib/utils/date.ts`
- `lib/utils/format.ts`
- `lib/utils/validation.ts`

---

## Phase 2: Database and Backend Setup

### Task 2.1: Initialize Supabase Project

**ID**: PLAC-010  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Create Supabase project, install Supabase client libraries, and configure environment variables.

**Acceptance Criteria**:

- Supabase project created
- @supabase/supabase-js and @supabase/ssr installed
- Environment variables configured (.env.local, .env.example)
- Supabase URL and anon key set
- Service role key secured (not exposed to client)

**Files Created**:

- `.env.local`
- `.env.example`

**Files Modified**:

- `package.json`

---

### Task 2.2: Create Supabase Client Utilities

**ID**: PLAC-011  
**Complexity**: Medium  
**Dependencies**: PLAC-010

**Description**:
Create client-side and server-side Supabase client utilities following the SSR pattern for Next.js App Router.

**Acceptance Criteria**:

- Browser client created for client components
- Server client created for Server Components and Actions
- Middleware client helper created
- Cookie handling implemented correctly
- Type-safe client creation
- Proper error handling

**Files Created**:

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`

---

### Task 2.3: Create Database Schema - Core Tables

**ID**: PLAC-012  
**Complexity**: High  
**Dependencies**: PLAC-010

**Description**:
Create initial database migration with core tables: profiles, target_profiles, skills, companies.

**Acceptance Criteria**:

- Migration file created with proper naming
- profiles table with all columns from design
- target_profiles table with validation constraints
- skills table with proficiency levels
- companies table with JSONB fields
- Foreign keys properly defined
- Constraints match requirements (hours 1-24, weeks 1-52, etc.)
- UUID primary keys using uuid_generate_v4()
- Timestamps (created_at, updated_at) on all tables

**Files Created**:

- `supabase/migrations/001_create_core_tables.sql`

---

### Task 2.4: Create Database Schema - Roadmap Tables

**ID**: PLAC-013  
**Complexity**: High  
**Dependencies**: PLAC-012

**Description**:
Create migration for roadmap-related tables: roadmaps, roadmap_nodes with dependencies and layout data.

**Acceptance Criteria**:

- roadmaps table created with completion tracking
- roadmap_nodes table with all fields from design
- node_type enum matches design (learning, project, assessment, milestone)
- status enum matches design (locked, available, in_progress, completed)
- difficulty_level enum defined
- JSONB columns for resources and layout_data
- Array columns for dependencies and required_skills
- Proper indexes on roadmap_id and status columns
- Foreign keys to roadmaps table

**Files Created**:

- `supabase/migrations/002_create_roadmap_tables.sql`

---

### Task 2.5: Create Database Schema - Learning Tables

**ID**: PLAC-014  
**Complexity**: Medium  
**Dependencies**: PLAC-012

**Description**:
Create migration for learning-related tables: resumes, resume_analyses, mock_interviews, interview_exchanges.

**Acceptance Criteria**:

- resumes table with file metadata
- resume_analyses table with JSONB for recommendations
- mock_interviews table with interview types
- interview_exchanges table with sequence tracking
- Proper enums for interview_type and interview_status
- Score columns with CHECK constraints (0-100)
- Array columns for strengths and areas_for_improvement
- Foreign keys properly defined

**Files Created**:

- `supabase/migrations/003_create_learning_tables.sql`

---

### Task 2.6: Create Database Schema - Planning Tables

**ID**: PLAC-015  
**Complexity**: Medium  
**Dependencies**: PLAC-012

**Description**:
Create migration for planning tables: daily_tasks, weekly_reviews, study_sessions, projects.

**Acceptance Criteria**:

- daily_tasks table with scheduling fields
- weekly_reviews table with analytics data
- study_sessions table for time tracking
- projects table with JSONB for phases and criteria
- Enums for task_priority, task_status, project_status
- Date and time columns properly typed
- Foreign keys to roadmap_nodes where applicable
- Indexes on date and user_id columns

**Files Created**:

- `supabase/migrations/004_create_planning_tables.sql`

---

### Task 2.7: Create Database Schema - System Tables

**ID**: PLAC-016  
**Complexity**: Low  
**Dependencies**: PLAC-012

**Description**:
Create migration for system tables: notifications, ai_conversations, ai_messages, analytics_events.

**Acceptance Criteria**:

- notifications table with type and priority enums
- ai_conversations table for chat history
- ai_messages table with role enum (user, assistant, system)
- analytics_events table for tracking
- JSONB columns for metadata and properties
- Indexes on user_id, created_at, and is_read
- Proper foreign keys

**Files Created**:

- `supabase/migrations/005_create_system_tables.sql`

---

### Task 2.8: Create Row Level Security Policies

**ID**: PLAC-017  
**Complexity**: High  
**Dependencies**: PLAC-012, PLAC-013, PLAC-014, PLAC-015, PLAC-016

**Description**:
Implement RLS policies for all tables ensuring users can only access their own data. Enable RLS and create policies for SELECT, INSERT, UPDATE, DELETE operations.

**Acceptance Criteria**:

- RLS enabled on all user data tables
- SELECT policies use auth.uid() = user_id pattern
- INSERT policies verify auth.uid() = user_id
- UPDATE policies restrict to own data
- DELETE policies restrict to own data
- Nested policies for roadmap_nodes (check roadmap ownership)
- Companies table has public read access
- All policies tested and working
- No data leakage between users

**Files Created**:

- `supabase/migrations/006_create_rls_policies.sql`

---

### Task 2.9: Create Database Functions and Triggers

**ID**: PLAC-018  
**Complexity**: Medium  
**Dependencies**: PLAC-017

**Description**:
Create database functions for updating timestamps, creating profiles on signup, and updating roadmap completion.

**Acceptance Criteria**:

- update_updated_at_column() function created
- Triggers applied to all tables with updated_at
- handle_new_user() function creates profile on auth.users INSERT
- update_roadmap_completion() function recalculates completion
- Trigger on roadmap_nodes updates roadmap statistics
- All functions are SECURITY DEFINER where needed
- Functions tested and working correctly

**Files Created**:

- `supabase/migrations/007_create_functions_triggers.sql`

---

### Task 2.10: Create Database Indexes

**ID**: PLAC-019  
**Complexity**: Low  
**Dependencies**: PLAC-017

**Description**:
Create indexes on frequently queried columns to optimize performance per design specifications.

**Acceptance Criteria**:

- Indexes on all user_id columns
- Composite indexes for common queries (user_id, date, status)
- GIN index on dependencies array column
- Indexes on created_at for sorting
- Indexes on status columns for filtering
- Index on notifications (user_id, is_read, created_at)
- All indexes named descriptively
- Query performance improved (verified with EXPLAIN)

**Files Created**:

- `supabase/migrations/008_create_indexes.sql`

---

### Task 2.11: Generate TypeScript Types from Database

**ID**: PLAC-020  
**Complexity**: Low  
**Dependencies**: PLAC-019

**Description**:
Use Supabase CLI to generate TypeScript types from database schema and create domain model interfaces.

**Acceptance Criteria**:

- Supabase CLI installed
- database.types.ts generated with all table types
- models.ts created with domain interfaces (Profile, Roadmap, etc.)
- Enums exported as TypeScript types
- Json type defined for JSONB columns
- Database type with Tables interface
- Types match database schema exactly

**Files Created**:

- `lib/types/database.types.ts`
- `lib/types/models.ts`
- `lib/types/index.ts`

---

### Task 2.12: Seed Database with Initial Data

**ID**: PLAC-021  
**Complexity**: Medium  
**Dependencies**: PLAC-019

**Description**:
Create seed data for companies table with popular tech companies including their interview processes, tech stacks, and preparation resources.

**Acceptance Criteria**:

- Seed file with 20+ major tech companies
- Each company includes: name, logo_url, website, industry, tech_stack
- Interview process with stages defined
- Common questions included (at least 5 per company)
- Coding patterns included
- Culture info and salary ranges added
- Seed script can be run multiple times (idempotent)

**Files Created**:

- `supabase/seed.sql`

---

## Phase 3: Authentication System

### Task 3.1: Create Auth Store

**ID**: PLAC-022  
**Complexity**: Medium  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement Zustand auth store with persistence for managing user authentication state.

**Acceptance Criteria**:

- Auth store created with user and session state
- setUser, setSession, signOut actions defined
- refreshSession action implemented
- Persist middleware configured
- State persisted to localStorage
- Type-safe with TypeScript
- Proper state initialization

**Files Created**:

- `lib/stores/auth.store.ts`

---

### Task 3.2: Create Auth Server Actions

**ID**: PLAC-023  
**Complexity**: High  
**Dependencies**: PLAC-011, PLAC-022

**Description**:
Implement server actions for authentication operations: signUp, signIn, signOut, resetPassword, verifyEmail.

**Acceptance Criteria**:

- signUp action with email/password
- signIn action with email/password
- signInWithOAuth action for Google and GitHub
- signOut action clears session
- resetPassword action sends email
- verifyEmail action confirms email
- All actions return { success, error } format
- Password validation enforced (8 chars, uppercase, lowercase, number)
- Error messages user-friendly
- revalidatePath called after state changes

**Files Created**:

- `lib/actions/auth.actions.ts`

---

### Task 3.3: Create Auth Layout and Pages

**ID**: PLAC-024  
**Complexity**: Medium  
**Dependencies**: PLAC-005, PLAC-006

**Description**:
Create auth layout and page structures for login, register, forgot-password, and verify-email.

**Acceptance Criteria**:

- Auth layout with centered card design
- Auth layout uses glass morphism effects
- Login page route created
- Register page route created
- Forgot password page route created
- Verify email page route created
- Layouts styled per design system
- Responsive design implemented

**Files Created**:

- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/verify-email/page.tsx`

---

### Task 3.4: Create Validation Schemas

**ID**: PLAC-025  
**Complexity**: Low  
**Dependencies**: PLAC-003

**Description**:
Create Zod validation schemas for all forms including auth, profile, target profile, skills, and tasks.

**Acceptance Criteria**:

- loginSchema with email and password validation
- registerSchema with password confirmation
- targetProfileSchema with all field validations
- skillSchema with proficiency 1-10
- dailyTaskSchema with time and duration validation
- profileUpdateSchema for settings
- Custom validation rules (package max >= min, hours 1-24, weeks 1-52)
- Error messages are user-friendly
- All schemas exported and typed

**Files Created**:

- `lib/validations/schemas.ts`
- `lib/validations/rules.ts`

---

### Task 3.5: Create Login Form Component

**ID**: PLAC-026  
**Complexity**: Medium  
**Dependencies**: PLAC-023, PLAC-025, PLAC-005

**Description**:
Build login form with email/password inputs, OAuth buttons, validation, and error handling using React Hook Form.

**Acceptance Criteria**:

- Form uses React Hook Form with Zod resolver
- Email and password inputs with proper labels
- Form validation with error messages
- Submit button with loading state
- OAuth buttons for Google and GitHub
- Link to register page
- Link to forgot password page
- Proper error handling and toast notifications
- Accessible form with ARIA labels

**Files Created**:

- `components/auth/login-form.tsx`
- `components/auth/oauth-buttons.tsx`

---

### Task 3.6: Create Register Form Component

**ID**: PLAC-027  
**Complexity**: Medium  
**Dependencies**: PLAC-023, PLAC-025, PLAC-005

**Description**:
Build registration form with email, password, confirm password, OAuth options, and validation.

**Acceptance Criteria**:

- Form uses React Hook Form with Zod resolver
- Email, password, and confirm password inputs
- Password strength indicator
- Password requirements displayed
- Form validation with real-time feedback
- Submit button with loading state
- OAuth buttons for Google and GitHub
- Link to login page
- Terms of service checkbox
- Success message and redirect to onboarding

**Files Created**:

- `components/auth/register-form.tsx`

---

### Task 3.7: Create Forgot Password Form

**ID**: PLAC-028  
**Complexity**: Low  
**Dependencies**: PLAC-023, PLAC-025, PLAC-005

**Description**:
Build forgot password form that sends password reset email.

**Acceptance Criteria**:

- Form with email input
- Email validation
- Submit button with loading state
- Success message after submission
- Link back to login
- Error handling
- Rate limiting message if applicable

**Files Created**:

- `components/auth/forgot-password-form.tsx`

---

### Task 3.8: Create Authentication Middleware

**ID**: PLAC-029  
**Complexity**: High  
**Dependencies**: PLAC-011, PLAC-022

**Description**:
Implement Next.js middleware for route protection, auth checks, and onboarding status verification.

**Acceptance Criteria**:

- Middleware checks authentication on protected routes
- Redirects unauthenticated users to /login
- Redirects authenticated users away from auth pages
- Checks onboarding_completed status
- Redirects incomplete onboarding to /onboarding
- Protected routes: /dashboard, /roadmap, /mentor, etc.
- Auth routes: /login, /register
- Session refresh handled automatically
- Proper matcher configuration

**Files Created**:

- `middleware.ts`

---

### Task 3.9: Create useAuth Hook

**ID**: PLAC-030  
**Complexity**: Low  
**Dependencies**: PLAC-022

**Description**:
Create custom hook for accessing auth state and actions throughout the application.

**Acceptance Criteria**:

- useAuth hook exports user, session, isLoading, isAuthenticated
- Hook provides signOut function
- Hook provides refreshSession function
- Type-safe return values
- Easy to use in components

**Files Created**:

- `lib/hooks/use-auth.ts`

---

## Phase 4: Onboarding Flow

### Task 4.1: Create Onboarding Layout

**ID**: PLAC-031  
**Complexity**: Low  
**Dependencies**: PLAC-024

**Description**:
Create onboarding layout with progress indicator and centered content area.

**Acceptance Criteria**:

- Onboarding layout with glass card design
- Progress indicator showing step x of 4
- Skip tour option (dismissible)
- Consistent styling with auth layout
- Responsive design
- Smooth animations

**Files Created**:

- `app/(onboarding)/layout.tsx`

---

### Task 4.2: Create Onboarding Wizard Component

**ID**: PLAC-032  
**Complexity**: High  
**Dependencies**: PLAC-031, PLAC-025

**Description**:
Build multi-step onboarding wizard with state management, navigation, and data persistence.

**Acceptance Criteria**:

- Wizard component with step state management
- Navigation between steps (Next, Previous, Skip)
- Form data persisted across steps
- Progress indicator updates
- Validation per step
- Final step triggers roadmap generation
- Smooth step transitions with Framer Motion
- Can resume from interruption (localStorage backup)

**Files Created**:

- `components/onboarding/onboarding-wizard.tsx`
- `app/(onboarding)/onboarding/page.tsx`

---

### Task 4.3: Create Welcome Step Component

**ID**: PLAC-033  
**Complexity**: Low  
**Dependencies**: PLAC-032

**Description**:
Build the welcome step with introduction to Placify and "Get Started" button.

**Acceptance Criteria**:

- Welcome message with app overview
- Key features highlighted
- Animated entrance with Framer Motion
- "Get Started" button proceeds to next step
- Visual appeal with gradients and icons
- Motivational copy

**Files Created**:

- `components/onboarding/welcome-step.tsx`

---

### Task 4.4: Create Target Profile Step Component

**ID**: PLAC-034  
**Complexity**: High  
**Dependencies**: PLAC-032, PLAC-025

**Description**:
Build target profile configuration step with all required inputs and validation.

**Acceptance Criteria**:

- Target role input with autocomplete suggestions
- Package range inputs (min/max) with currency selector
- Company multi-select with search
- Available hours per day slider (1-24)
- Timeline weeks slider (1-52)
- Start date picker (defaults to today)
- Form validation with targetProfileSchema
- Real-time error messages
- Visual feedback on input
- Accessible form controls

**Files Created**:

- `components/onboarding/target-profile-step.tsx`

---

### Task 4.5: Create Skills Step Component

**ID**: PLAC-035  
**Complexity**: Medium  
**Dependencies**: PLAC-032, PLAC-025

**Description**:
Build skills input step with dynamic skill addition, proficiency selection, and suggestions.

**Acceptance Criteria**:

- Skill name input with autocomplete
- Proficiency level selector (1-10) with visual indicator
- Category tags (technical/soft/domain)
- Add skill button
- Skill list with edit/delete options
- Skill suggestions based on target role
- Minimum 3 skills required
- Validation with skillSchema
- Drag to reorder skills

**Files Created**:

- `components/onboarding/skills-step.tsx`

---

### Task 4.6: Create Preferences Step Component

**ID**: PLAC-036  
**Complexity**: Low  
**Dependencies**: PLAC-032

**Description**:
Build preferences step for theme selection and notification settings.

**Acceptance Criteria**:

- Theme selector (dark/light) with preview
- Notification preference toggles (email, in-app, reminders, weekly review, milestones)
- Email digest frequency selector
- Visual theme preview
- Settings saved to profile
- "Complete" button finishes onboarding

**Files Created**:

- `components/onboarding/preferences-step.tsx`

---

### Task 4.7: Create Profile Server Actions

**ID**: PLAC-037  
**Complexity**: Medium  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement server actions for creating and updating user profiles, target profiles, and skills.

**Acceptance Criteria**:

- createTargetProfile action saves target profile data
- updateTargetProfile action for modifications
- createSkill action adds skill with proficiency
- updateSkills action for bulk skill updates
- updateProfilePreferences action for theme and notifications
- completeOnboarding action sets onboarding_completed = true
- All actions validate input with Zod
- Error handling with descriptive messages
- revalidatePath after mutations

**Files Created**:

- `lib/actions/profile.actions.ts`

---

### Task 4.8: Integrate Onboarding with Database

**ID**: PLAC-038  
**Complexity**: Medium  
**Dependencies**: PLAC-032, PLAC-037

**Description**:
Connect onboarding wizard to server actions, save data to database, and handle completion flow.

**Acceptance Criteria**:

- Target profile saved on step completion
- Skills saved to database
- Preferences updated in profile
- onboarding_completed set to true
- Loading states during save operations
- Error handling with toast notifications
- Optimistic UI updates
- Redirect to dashboard after completion

**Files Modified**:

- `components/onboarding/onboarding-wizard.tsx`
- `components/onboarding/target-profile-step.tsx`
- `components/onboarding/skills-step.tsx`
- `components/onboarding/preferences-step.tsx`

---

## Phase 5: Dashboard Layout and Navigation

### Task 5.1: Create Dashboard Layout

**ID**: PLAC-039  
**Complexity**: Medium  
**Dependencies**: PLAC-005, PLAC-029

**Description**:
Build main dashboard layout with sidebar, top bar, and content area.

**Acceptance Criteria**:

- Dashboard layout with sidebar and main content
- Sidebar with navigation links
- Top bar with search, notifications, and user menu
- Responsive design (hamburger menu on mobile)
- Smooth layout transitions
- Glass morphism effects
- Active route highlighting

**Files Created**:

- `app/(dashboard)/layout.tsx`
- `components/layouts/dashboard-layout.tsx`

---

### Task 5.2: Create Sidebar Component

**ID**: PLAC-040  
**Complexity**: Medium  
**Dependencies**: PLAC-039

**Description**:
Build sidebar navigation with icons, labels, and active state indicators.

**Acceptance Criteria**:

- Navigation links for all main sections (Dashboard, Roadmap, Mentor, Interview, Resume, Planner, Analytics, Companies, Projects, Settings)
- Icons from Lucide React
- Active route highlighted
- Hover effects with glow
- Collapsible on mobile
- Logo and app name at top
- User info at bottom
- Keyboard accessible

**Files Created**:

- `components/layouts/sidebar.tsx`

---

### Task 5.3: Create Top Bar Component

**ID**: PLAC-041  
**Complexity**: Medium  
**Dependencies**: PLAC-039, PLAC-030

**Description**:
Build top bar with search, notifications bell, and user menu dropdown.

**Acceptance Criteria**:

- Global search input with keyboard shortcut (Cmd/Ctrl + K)
- Notification bell with unread count badge
- User menu dropdown with profile, settings, sign out
- Avatar display
- Responsive design
- Smooth animations
- Keyboard navigation

**Files Created**:

- `components/layouts/top-bar.tsx`
- `components/shared/search-bar.tsx`

---

### Task 5.4: Create Notification Bell and Dropdown

**ID**: PLAC-042  
**Complexity**: Medium  
**Dependencies**: PLAC-041

**Description**:
Build notifications dropdown showing recent notifications with mark as read functionality.

**Acceptance Criteria**:

- Notification bell icon with badge showing unread count
- Dropdown opens on click
- List of recent notifications (last 10)
- Mark as read on click
- Mark all as read button
- Link to notification action
- Empty state when no notifications
- Real-time updates (later with real-time subscriptions)
- Smooth animations

**Files Created**:

- `components/layouts/notification-bell.tsx`
- `components/layouts/notification-dropdown.tsx`

---

### Task 5.5: Create User Menu Dropdown

**ID**: PLAC-043  
**Complexity**: Low  
**Dependencies**: PLAC-041, PLAC-030

**Description**:
Build user menu dropdown with profile link, settings link, and sign out.

**Acceptance Criteria**:

- User avatar triggers dropdown
- User name and email displayed
- Link to profile settings
- Theme toggle
- Sign out button
- Smooth dropdown animation
- Click outside to close
- Keyboard accessible

**Files Created**:

- `components/layouts/user-menu.tsx`

---

### Task 5.6: Create Dashboard Home Page

**ID**: PLAC-044  
**Complexity**: Medium  
**Dependencies**: PLAC-039

**Description**:
Build dashboard home page with overview widgets: stats, upcoming tasks, recent activity, quick actions.

**Acceptance Criteria**:

- Welcome message with user name
- Stats overview cards (roadmap progress, study hours, interview score, streak)
- Upcoming tasks widget (next 3-5 tasks)
- Recent activity feed
- Quick action buttons (Start Learning, Schedule Interview, etc.)
- Responsive grid layout
- Loading skeletons for data fetching
- Animated entrance

**Files Created**:

- `app/(dashboard)/dashboard/page.tsx`
- `components/dashboard/stats-overview.tsx`
- `components/dashboard/upcoming-tasks.tsx`
- `components/dashboard/recent-activity.tsx`
- `components/dashboard/quick-actions.tsx`

---

### Task 5.7: Create Notifications Store

**ID**: PLAC-045  
**Complexity**: Low  
**Dependencies**: PLAC-020

**Description**:
Implement Zustand store for managing notifications state.

**Acceptance Criteria**:

- Notifications array in state
- unreadCount computed from state
- setNotifications action
- addNotification action
- markAsRead action
- markAllAsRead action
- removeNotification action
- Type-safe with TypeScript

**Files Created**:

- `lib/stores/notifications.store.ts`

---

## Phase 6: OpenAI Integration Setup

### Task 6.1: Install and Configure OpenAI SDK

**ID**: PLAC-046  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Install OpenAI SDK, configure API key, and create client utility.

**Acceptance Criteria**:

- openai package installed
- ai package installed (Vercel AI SDK)
- OPENAI_API_KEY in environment variables
- OpenAI client created with proper configuration
- Error handling for API failures
- Rate limiting considerations documented

**Files Created**:

- `lib/openai/client.ts`

**Files Modified**:

- `.env.local`
- `.env.example`
- `package.json`

---

### Task 6.2: Create AI Utility Functions

**ID**: PLAC-047  
**Complexity**: Medium  
**Dependencies**: PLAC-046

**Description**:
Create utility functions for common AI operations: chat completions, structured outputs, streaming responses.

**Acceptance Criteria**:

- Function for chat completion with context
- Function for structured JSON responses
- Function for streaming responses
- System prompt builders
- Token counting utilities
- Error handling and retries
- Cost tracking helpers
- Type-safe response parsing

**Files Created**:

- `lib/openai/chat.ts`
- `lib/openai/generation.ts`
- `lib/openai/utils.ts`

---

## Phase 7: Roadmap System

### Task 7.1: Create Roadmap Store

**ID**: PLAC-048  
**Complexity**: Medium  
**Dependencies**: PLAC-020

**Description**:
Implement Zustand store for managing roadmap and nodes state.

**Acceptance Criteria**:

- currentRoadmap in state
- nodes array in state
- selectedNode for modal
- setRoadmap action
- setNodes action
- selectNode action
- updateNodeStatus action with optimistic update
- addNode and removeNode actions
- Type-safe with TypeScript

**Files Created**:

- `lib/stores/roadmap.store.ts`

---

### Task 7.2: Create Roadmap Server Actions

**ID**: PLAC-049  
**Complexity**: High  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement server actions for roadmap CRUD operations and node status updates.

**Acceptance Criteria**:

- getRoadmap action fetches user's roadmap
- getRoadmapNodes action fetches all nodes
- updateNodeStatus action with validation
- updateNodePosition action for layout changes
- saveRoadmapLayout action persists custom positions
- startNode action (sets status to in_progress, records timestamp)
- completeNode action (sets status to completed, unlocks dependencies)
- All actions validate ownership
- Error handling with descriptive messages

**Files Created**:

- `lib/actions/roadmap.actions.ts`

---

### Task 7.3: Install and Configure React Flow

**ID**: PLAC-050  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Install React Flow library and configure for roadmap visualization.

**Acceptance Criteria**:

- reactflow package installed
- React Flow styles imported
- Basic setup tested
- Touch gestures enabled for mobile
- Performance optimizations configured

**Files Modified**:

- `package.json`
- `app/globals.css`

---

### Task 7.4: Create Custom Node Component

**ID**: PLAC-051  
**Complexity**: High  
**Dependencies**: PLAC-050

**Description**:
Build custom React Flow node component with status-based styling, animations, and interactions.

**Acceptance Criteria**:

- Custom node component extends React Flow Node
- Status-based styling (locked: grayscale, available: blue glow, in_progress: purple glow pulsing, completed: green with checkmark)
- Node displays title and icon
- Hover effect with scale animation
- Click opens node details modal
- Drag and drop for repositioning
- Touch-optimized for mobile (44px minimum)
- Accessible with keyboard navigation
- Smooth animations with Framer Motion

**Files Created**:

- `components/roadmap/custom-node.tsx`

---

### Task 7.5: Create Roadmap Canvas Component

**ID**: PLAC-052  
**Complexity**: High  
**Dependencies**: PLAC-050, PLAC-051, PLAC-048

**Description**:
Build main roadmap visualization using React Flow with custom nodes, edges, controls, and interactions.

**Acceptance Criteria**:

- React Flow canvas with custom nodes
- Edges showing dependencies with arrows
- Minimap for overview
- Controls (zoom, pan, fit view)
- Auto-layout algorithm for initial positioning
- Drag and drop node repositioning
- Layout persistence to database
- Zoom levels 25% to 200%
- Touch gestures for mobile
- Loading state
- Empty state if no roadmap

**Files Created**:

- `components/roadmap/roadmap-canvas.tsx`
- `components/roadmap/roadmap-controls.tsx`

---

### Task 7.6: Create Node Details Modal

**ID**: PLAC-053  
**Complexity**: Medium  
**Dependencies**: PLAC-006, PLAC-051

**Description**:
Build modal component that displays detailed node information and actions.

**Acceptance Criteria**:

- Modal displays node title, description, content
- Shows estimated hours vs actual hours
- Displays required skills as badges
- Lists learning resources with links
- Shows dependencies (other nodes)
- Displays node status and type
- Action buttons (Start Learning, Mark Complete, Edit)
- Progress indicator within node
- Accessible modal with focus trap
- Smooth animations

**Files Created**:

- `components/roadmap/node-details-modal.tsx`

---

### Task 7.7: Create Progress Sidebar

**ID**: PLAC-054  
**Complexity**: Medium  
**Dependencies**: PLAC-048

**Description**:
Build sidebar showing roadmap completion stats and milestone progress.

**Acceptance Criteria**:

- Overall completion percentage with circular progress
- Nodes completed / total nodes
- Current milestone indicator
- Estimated completion date
- Study hours logged
- Next recommended nodes
- Filter nodes by status
- Collapsible on mobile
- Animated progress updates

**Files Created**:

- `components/roadmap/progress-sidebar.tsx`

---

### Task 7.8: Create Roadmap Page

**ID**: PLAC-055  
**Complexity**: Medium  
**Dependencies**: PLAC-052, PLAC-053, PLAC-054

**Description**:
Build roadmap page integrating canvas, node details modal, and progress sidebar.

**Acceptance Criteria**:

- Page fetches roadmap and nodes server-side
- Roadmap canvas rendered with data
- Progress sidebar visible
- Node click opens details modal
- Loading states with skeletons
- Error handling
- Responsive layout (sidebar collapses on mobile)
- Page title and metadata
- Smooth page transitions

**Files Created**:

- `app/(dashboard)/roadmap/page.tsx`

---

### Task 7.9: Create AI Roadmap Generation API Route

**ID**: PLAC-056  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047, PLAC-011

**Description**:
Build API route that generates personalized roadmap using OpenAI based on target profile and skills.

**Acceptance Criteria**:

- POST /api/ai/roadmap-generation endpoint
- Fetches user's target profile and skills
- Constructs detailed prompt with context
- Calls OpenAI API for roadmap generation
- Parses structured response (nodes with dependencies)
- Creates roadmap and nodes in database
- Calculates auto-layout positions
- Returns roadmap ID
- Error handling and retries
- Response time < 15 seconds
- Validates generated data structure

**Files Created**:

- `app/api/ai/roadmap-generation/route.ts`

---

### Task 7.10: Integrate Roadmap Generation with Onboarding

**ID**: PLAC-057  
**Complexity**: Medium  
**Dependencies**: PLAC-056, PLAC-038

**Description**:
Connect onboarding completion to roadmap generation with loading state and error handling.

**Acceptance Criteria**:

- Call roadmap generation API after onboarding completion
- Loading modal with progress animation
- Loading text updates ("Analyzing your profile...", "Building your roadmap...", "Almost ready...")
- Success animation when complete
- Error handling with retry option
- Redirect to roadmap page on success
- Timeout handling (if generation takes > 30 seconds)

**Files Modified**:

- `components/onboarding/onboarding-wizard.tsx`

---

## Phase 8: AI Mentor Chat

### Task 8.1: Create AI Conversations Store

**ID**: PLAC-058  
**Complexity**: Low  
**Dependencies**: PLAC-020

**Description**:
Implement Zustand store for managing AI chat conversations and messages.

**Acceptance Criteria**:

- currentConversation in state
- messages array in state
- isStreaming boolean for loading state
- setConversation action
- addMessage action (optimistic)
- updateLastMessage for streaming
- clearMessages action
- Type-safe with TypeScript

**Files Created**:

- `lib/stores/chat.store.ts`

---

### Task 8.2: Create AI Chat API Route

**ID**: PLAC-059  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047, PLAC-011

**Description**:
Build streaming AI chat API route with context awareness and conversation history.

**Acceptance Criteria**:

- POST /api/ai/chat endpoint with streaming
- Fetches user's target profile and current progress for context
- Constructs system prompt with personalized context
- Streams GPT-4 responses using Vercel AI SDK
- Saves user message and AI response to database
- Updates conversation last_message_at timestamp
- Maintains conversation context (last 10 messages)
- Error handling for API failures
- Rate limiting per user
- Response time < 5 seconds for first token

**Files Created**:

- `app/api/ai/chat/route.ts`

---

### Task 8.3: Create Message Bubble Component

**ID**: PLAC-060  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build message bubble component with markdown rendering, code syntax highlighting, and copy functionality.

**Acceptance Criteria**:

- Message bubble with role-based styling (user: right-aligned blue, assistant: left-aligned purple)
- Markdown rendering with react-markdown
- Code syntax highlighting with prism/highlight.js
- Copy message button
- Timestamp display
- Avatar for assistant messages
- Typing indicator for streaming
- Smooth entrance animation
- Accessible with proper ARIA labels

**Files Created**:

- `components/mentor/message-bubble.tsx`

---

### Task 8.4: Create Message List Component

**ID**: PLAC-061  
**Complexity**: Medium  
**Dependencies**: PLAC-060

**Description**:
Build scrollable message list with auto-scroll, virtualization for performance, and loading states.

**Acceptance Criteria**:

- Scrollable container with messages
- Auto-scroll to bottom on new message
- Virtualization for long conversations (react-window)
- Loading indicator while fetching history
- Empty state for new conversations
- Scroll to top to load more (pagination)
- Smooth scroll behavior
- Date separators for different days

**Files Created**:

- `components/mentor/message-list.tsx`

---

### Task 8.5: Create Message Input Component

**ID**: PLAC-062  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build message input with multi-line support, send button, keyboard shortcuts, and character limit.

**Acceptance Criteria**:

- Textarea with auto-resize (max 5 lines)
- Send button (disabled when empty or streaming)
- Keyboard shortcut (Enter to send, Shift+Enter for new line)
- Character counter (max 2000 characters)
- Disabled state during streaming
- Loading indicator during send
- Clear input after send
- Focus management
- Paste support
- Accessible with proper labels

**Files Created**:

- `components/mentor/message-input.tsx`

---

### Task 8.6: Create Suggested Prompts Component

**ID**: PLAC-063  
**Complexity**: Low  
**Dependencies**: PLAC-005

**Description**:
Build component showing suggested conversation starters based on user's current progress.

**Acceptance Criteria**:

- Display 3-5 suggested prompts
- Prompts personalized to user's roadmap progress
- Click prompt to send as message
- Hover effects with glow
- Only show when conversation is empty
- Smooth fade out when message sent
- Prompts relevant to target role and companies

**Files Created**:

- `components/mentor/suggested-prompts.tsx`

---

### Task 8.7: Create Chat Interface Component

**ID**: PLAC-064  
**Complexity**: High  
**Dependencies**: PLAC-061, PLAC-062, PLAC-063, PLAC-058

**Description**:
Build complete chat interface integrating message list, input, suggested prompts, and streaming.

**Acceptance Criteria**:

- Chat container with header
- Message list with scroll container
- Message input at bottom
- Suggested prompts when empty
- Handles streaming responses
- Optimistic message updates
- Error handling with retry
- Connection status indicator
- Conversation persistence
- Keyboard shortcuts displayed

**Files Created**:

- `components/mentor/chat-interface.tsx`

---

### Task 8.8: Create Mentor Page

**ID**: PLAC-065  
**Complexity**: Medium  
**Dependencies**: PLAC-064

**Description**:
Build AI mentor page with chat interface and conversation management.

**Acceptance Criteria**:

- Page fetches or creates conversation
- Chat interface rendered
- Conversation history loaded
- Page title and description
- Responsive layout
- Loading states
- Error boundaries
- Metadata for SEO

**Files Created**:

- `app/(dashboard)/mentor/page.tsx`

---

## Phase 9: Mock Interview System

### Task 9.1: Create Interview Setup Component

**ID**: PLAC-066  
**Complexity**: Medium  
**Dependencies**: PLAC-005, PLAC-025

**Description**:
Build interview setup form for selecting type, company, and duration.

**Acceptance Criteria**:

- Interview type selector (technical, behavioral, hr)
- Target company dropdown (optional)
- Duration slider (15-60 minutes)
- Target role pre-filled from profile
- Form validation
- "Start Interview" button
- Visual preview of selections
- Accessibility compliant

**Files Created**:

- `components/interview/interview-setup.tsx`

---

### Task 9.2: Create Interview Question Generation API

**ID**: PLAC-067  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047

**Description**:
Build API route that generates interview questions based on type, role, and company using OpenAI.

**Acceptance Criteria**:

- POST /api/ai/interview/generate-question endpoint
- Accepts interview type, role, company, previous questions
- Generates contextually relevant question
- Returns question with difficulty level and type
- Adapts difficulty based on previous responses
- Questions follow company-specific patterns when company selected
- Response time < 5 seconds
- Error handling and fallback questions

**Files Created**:

- `app/api/ai/interview/generate-question/route.ts`

---

### Task 9.3: Create Interview Answer Evaluation API

**ID**: PLAC-068  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047

**Description**:
Build API route that evaluates user's interview answer and provides feedback.

**Acceptance Criteria**:

- POST /api/ai/interview/evaluate-answer endpoint
- Accepts question, answer, interview type, role
- Evaluates answer for accuracy, clarity, completeness
- Returns score (0-100) and detailed feedback
- Identifies strengths and areas for improvement
- Response time < 8 seconds
- Constructive feedback with examples

**Files Created**:

- `app/api/ai/interview/evaluate-answer/route.ts`

---

### Task 9.4: Create Active Interview Component

**ID**: PLAC-069  
**Complexity**: High  
**Dependencies**: PLAC-067, PLAC-068, PLAC-005

**Description**:
Build active interview interface with question display, answer input, timer, and navigation.

**Acceptance Criteria**:

- Question card with clear typography
- Large textarea for answer input
- Timer display showing remaining time
- Question counter (1/10, 2/10, etc.)
- Submit answer button
- Next question automatically loads after evaluation
- Loading state during evaluation
- Progress bar showing interview completion
- End interview button with confirmation
- Auto-save answers (draft)
- Keyboard accessible

**Files Created**:

- `components/interview/active-interview.tsx`

---

### Task 9.5: Create Interview Summary API

**ID**: PLAC-070  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047

**Description**:
Build API route that generates comprehensive interview feedback and calculates overall score.

**Acceptance Criteria**:

- POST /api/ai/interview/generate-summary endpoint
- Accepts all questions, answers, and individual scores
- Generates overall feedback
- Calculates weighted overall score
- Identifies top 3 strengths
- Identifies top 3 areas for improvement
- Provides actionable recommendations
- Response time < 12 seconds
- Saves summary to database

**Files Created**:

- `app/api/ai/interview/generate-summary/route.ts`

---

### Task 9.6: Create Interview Results Component

**ID**: PLAC-071  
**Complexity**: Medium  
**Dependencies**: PLAC-070, PLAC-005

**Description**:
Build interview results page showing scores, feedback, and detailed breakdown.

**Acceptance Criteria**:

- Overall score with animated circular gauge
- Strengths list with icons
- Areas for improvement with icons
- Question-by-question breakdown (accordion)
- Detailed feedback for each answer
- Recommendations section
- Share/export results button
- Retake interview button
- View similar interviews button
- Smooth animations

**Files Created**:

- `components/interview/interview-results.tsx`

---

### Task 9.7: Create Interview History Component

**ID**: PLAC-072  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build component showing past interviews with filtering and score trends.

**Acceptance Criteria**:

- List of completed interviews
- Filter by type, company, date range
- Sort by date or score
- Interview card shows: type, company, date, score, duration
- Click to view details
- Score trend chart over time
- Empty state for no interviews
- Pagination for long lists
- Loading skeletons

**Files Created**:

- `components/interview/interview-history.tsx`

---

### Task 9.8: Create Interview Server Actions

**ID**: PLAC-073  
**Complexity**: Medium  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement server actions for creating, updating, and fetching interviews.

**Acceptance Criteria**:

- createInterview action initializes interview record
- saveInterviewExchange action saves question/answer pair
- updateInterviewStatus action updates status
- completeInterview action marks as completed
- getInterview action fetches interview with exchanges
- getInterviewHistory action with filtering
- All actions validate user ownership
- Error handling

**Files Created**:

- `lib/actions/interview.actions.ts`

---

### Task 9.9: Create Interview Pages

**ID**: PLAC-074  
**Complexity**: High  
**Dependencies**: PLAC-066, PLAC-069, PLAC-071, PLAC-072, PLAC-073

**Description**:
Build interview pages: list, setup, active interview, and results.

**Acceptance Criteria**:

- /interview page shows interview history and new interview button
- /interview/new page shows setup form
- /interview/[id] page shows active interview or results based on status
- Proper routing and navigation
- Loading states for all pages
- Error boundaries
- Metadata for SEO
- Responsive layouts

**Files Created**:

- `app/(dashboard)/interview/page.tsx`
- `app/(dashboard)/interview/new/page.tsx`
- `app/(dashboard)/interview/[id]/page.tsx`

---

## Phase 10: Resume Analysis

### Task 10.1: Configure Supabase Storage

**ID**: PLAC-075  
**Complexity**: Low  
**Dependencies**: PLAC-010

**Description**:
Set up Supabase storage bucket for resume file uploads with security policies.

**Acceptance Criteria**:

- Storage bucket "resumes" created
- RLS policies restrict access to own files
- File size limit 5MB enforced
- Allowed file types: PDF, DOCX, TXT
- Public access disabled
- Signed URLs for secure access

**Files Created**:

- Storage bucket configuration in Supabase dashboard

---

### Task 10.2: Create Resume Upload Component

**ID**: PLAC-076  
**Complexity**: Medium  
**Dependencies**: PLAC-075, PLAC-005

**Description**:
Build drag-and-drop resume upload component with validation and progress tracking.

**Acceptance Criteria**:

- Drag and drop zone
- File picker as alternative
- File type validation (PDF, DOCX, TXT)
- File size validation (max 5MB)
- Upload progress bar
- Preview uploaded file name
- Delete uploaded file option
- Multiple file upload support
- Error handling with descriptive messages
- Accessible with keyboard

**Files Created**:

- `components/resume/resume-uploader.tsx`

---

### Task 10.3: Create Resume Text Extraction Utility

**ID**: PLAC-077  
**Complexity**: Medium  
**Dependencies**: PLAC-001

**Description**:
Implement utility to extract text from PDF, DOCX, and TXT files.

**Acceptance Criteria**:

- Install pdf-parse for PDF extraction
- Install mammoth for DOCX extraction
- Text extraction from TXT files
- Error handling for corrupted files
- Preserve basic formatting
- Return plain text string
- Handle multi-page PDFs
- Character encoding handled correctly

**Files Created**:

- `lib/utils/resume-parser.ts`

**Files Modified**:

- `package.json`

---

### Task 10.4: Create Resume Analysis API Route

**ID**: PLAC-078  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047, PLAC-077

**Description**:
Build API route that analyzes resume using OpenAI and provides comprehensive feedback.

**Acceptance Criteria**:

- POST /api/ai/resume-analysis endpoint
- Accepts resume ID and content
- Fetches user's target profile for context
- Sends resume content to OpenAI with detailed prompt
- Receives structured JSON response with scores and feedback
- Parses: overall_score, formatting_score, content_score, keyword_score
- Extracts strengths, weaknesses, missing_keywords, recommendations
- Saves analysis to database
- Returns analysis ID
- Response time < 15 seconds
- Error handling and retries

**Files Created**:

- `app/api/ai/resume-analysis/route.ts`

---

### Task 10.5: Create Resume Analysis Results Component

**ID**: PLAC-079  
**Complexity**: High  
**Dependencies**: PLAC-078, PLAC-005

**Description**:
Build component displaying resume analysis results with scores, feedback, and recommendations.

**Acceptance Criteria**:

- Overall score with animated circular progress
- Score breakdown (formatting, content, keywords) with gauges
- Strengths section with checkmark icons
- Weaknesses section with warning icons
- Missing keywords with importance badges
- Detailed recommendations with examples
- Side-by-side view: issue vs. suggestion
- Copy individual suggestions button
- Export report as PDF button
- Visually appealing with gradients and animations

**Files Created**:

- `components/resume/analysis-results.tsx`
- `components/resume/improvement-suggestions.tsx`

---

### Task 10.6: Create Resume Viewer Component

**ID**: PLAC-080  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build component for viewing uploaded resume with text preview or PDF rendering.

**Acceptance Criteria**:

- Display resume file name and upload date
- For TXT: show formatted text
- For PDF: embed PDF viewer or convert to images
- For DOCX: show extracted text
- Download original file button
- Delete resume button with confirmation
- Set as primary resume toggle
- Responsive layout

**Files Created**:

- `components/resume/resume-viewer.tsx`

---

### Task 10.7: Create Resume Server Actions

**ID**: PLAC-081  
**Complexity**: Medium  
**Dependencies**: PLAC-011, PLAC-020, PLAC-075

**Description**:
Implement server actions for resume upload, deletion, and analysis retrieval.

**Acceptance Criteria**:

- uploadResume action handles file upload to storage
- createResumeRecord action saves metadata to database
- deleteResume action removes file and database record
- setPrimaryResume action updates is_primary flag
- getResumes action fetches user's resumes
- getResumeAnalysis action fetches analysis by resume ID
- All actions validate user ownership
- Error handling with descriptive messages

**Files Created**:

- `lib/actions/resume.actions.ts`

---

### Task 10.8: Create Resume Page

**ID**: PLAC-082  
**Complexity**: High  
**Dependencies**: PLAC-076, PLAC-079, PLAC-080, PLAC-081

**Description**:
Build resume page integrating upload, viewer, and analysis components.

**Acceptance Criteria**:

- Upload section at top
- List of uploaded resumes
- Click resume to view details and analysis
- Analysis results displayed below resume
- Loading states during upload and analysis
- Error boundaries
- Empty state for no resumes
- Responsive layout
- Page metadata

**Files Created**:

- `app/(dashboard)/resume/page.tsx`

---

## Phase 11: Daily Planner

### Task 11.1: Create Planner Store

**ID**: PLAC-083  
**Complexity**: Low  
**Dependencies**: PLAC-020

**Description**:
Implement Zustand store for managing daily tasks state.

**Acceptance Criteria**:

- tasks array in state
- selectedDate in state
- setTasks action
- addTask action with optimistic update
- updateTask action
- deleteTask action
- reorderTasks action for drag and drop
- filterTasksByDate helper
- Type-safe with TypeScript

**Files Created**:

- `lib/stores/planner.store.ts`

---

### Task 11.2: Create Task Server Actions

**ID**: PLAC-084  
**Complexity**: Medium  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement server actions for task CRUD operations and scheduling.

**Acceptance Criteria**:

- createTask action with validation
- updateTask action for editing
- deleteTask action with confirmation
- toggleTaskStatus action (pending → in_progress → completed)
- getTasksByDate action with filtering
- suggestTasks action generates AI suggestions
- reorderTasks action saves new order
- All actions validate user ownership
- Error handling

**Files Created**:

- `lib/actions/tasks.actions.ts`

---

### Task 11.3: Create Task Card Component

**ID**: PLAC-085  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build task card with checkbox, title, time, priority indicator, and actions.

**Acceptance Criteria**:

- Checkbox to toggle completion
- Task title and description
- Scheduled time display
- Duration badge
- Priority indicator (color-coded)
- Linked roadmap node badge (if applicable)
- Edit and delete buttons
- Drag handle for reordering
- Hover effects
- Status-based styling
- Smooth animations

**Files Created**:

- `components/planner/task-card.tsx`

---

### Task 11.4: Create Task List Component

**ID**: PLAC-086  
**Complexity**: High  
**Dependencies**: PLAC-085, PLAC-083

**Description**:
Build task list with grouping, drag-and-drop reordering, and filtering.

**Acceptance Criteria**:

- Tasks grouped by priority (high, medium, low)
- Drag and drop to reorder (react-beautiful-dnd)
- Filter by status (all, pending, completed)
- Sort options (priority, time, creation date)
- Empty state for each priority group
- Completed tasks collapsible section
- Loading skeletons
- Smooth animations
- Touch-friendly on mobile

**Files Created**:

- `components/planner/task-list.tsx`

**Files Modified**:

- `package.json` (install @dnd-kit/core or react-beautiful-dnd)

---

### Task 11.5: Create Task Form Component

**ID**: PLAC-087  
**Complexity**: Medium  
**Dependencies**: PLAC-025, PLAC-005

**Description**:
Build task creation/editing form with validation and roadmap node linking.

**Acceptance Criteria**:

- Title input (required, max 200 chars)
- Description textarea (optional, max 1000 chars)
- Date picker (defaults to today)
- Time picker (optional)
- Duration input in minutes
- Priority selector (low, medium, high)
- Roadmap node selector (optional dropdown)
- Form validation with dailyTaskSchema
- Submit button with loading state
- Cancel button
- Accessible form
- Can be used in modal or inline

**Files Created**:

- `components/planner/task-form.tsx`

---

### Task 11.6: Create Calendar Component

**ID**: PLAC-088  
**Complexity**: Medium  
**Dependencies**: PLAC-083

**Description**:
Build mini calendar for date selection and task count indicators.

**Acceptance Criteria**:

- Month view with date grid
- Current date highlighted
- Selected date highlighted
- Task count indicators on dates with tasks
- Navigation arrows (previous/next month)
- Today button
- Click date to filter tasks
- Responsive design
- Keyboard navigation
- Accessible with ARIA

**Files Created**:

- `components/planner/calendar.tsx`

---

### Task 11.7: Create Daily Stats Component

**ID**: PLAC-089  
**Complexity**: Low  
**Dependencies**: PLAC-083

**Description**:
Build component showing daily task statistics and progress.

**Acceptance Criteria**:

- Tasks completed / total tasks
- Hours logged / hours planned
- Completion percentage with circular progress
- Current streak display
- Motivational message based on progress
- Visual indicators (icons, colors)
- Real-time updates
- Smooth animations

**Files Created**:

- `components/planner/daily-stats.tsx`

---

### Task 11.8: Create Planner Page

**ID**: PLAC-090  
**Complexity**: High  
**Dependencies**: PLAC-086, PLAC-087, PLAC-088, PLAC-089, PLAC-084

**Description**:
Build planner page integrating calendar, task list, form, and stats.

**Acceptance Criteria**:

- Calendar on left sidebar
- Task list in center
- Daily stats at top
- Add task button opens form modal
- Date selection filters tasks
- Loading states for data fetching
- Error boundaries
- Responsive layout (calendar collapses on mobile)
- Page metadata
- Real-time task updates

**Files Created**:

- `app/(dashboard)/planner/page.tsx`

---

## Phase 12: Analytics Dashboard

### Task 12.1: Install and Configure Recharts

**ID**: PLAC-091  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Install Recharts library for data visualization and configure theming.

**Acceptance Criteria**:

- recharts package installed
- Recharts components work with Tailwind
- Custom theme colors configured
- Responsive charts configuration
- Accessibility features enabled

**Files Modified**:

- `package.json`

---

### Task 12.2: Create Analytics Server Actions

**ID**: PLAC-092  
**Complexity**: High  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement server actions for fetching and aggregating analytics data.

**Acceptance Criteria**:

- getProgressStats action (roadmap completion, study hours, etc.)
- getStudyHoursOverTime action with date range
- getMockInterviewScores action with trend data
- getSkillProficiency action for radar chart
- getTaskCompletionRates action by day
- getStreakData action for current and longest streak
- All actions aggregate data efficiently
- Date range filtering support
- Error handling

**Files Created**:

- `lib/actions/analytics.actions.ts`

---

### Task 12.3: Create Metrics Grid Component

**ID**: PLAC-093  
**Complexity**: Medium  
**Dependencies**: PLAC-005, PLAC-092

**Description**:
Build grid of metric cards showing key statistics.

**Acceptance Criteria**:

- Metric cards for: roadmap completion, study hours, interview score, streak
- Each card shows: icon, label, value, change percentage
- Color-coded based on trend (green up, red down)
- Smooth number animations (count-up)
- Glass card styling
- Responsive grid (4 columns desktop, 2 mobile)
- Loading skeletons
- Hover effects

**Files Created**:

- `components/analytics/metrics-grid.tsx`

---

### Task 12.4: Create Progress Chart Component

**ID**: PLAC-094  
**Complexity**: Medium  
**Dependencies**: PLAC-091, PLAC-092

**Description**:
Build line chart showing roadmap progress and study hours over time.

**Acceptance Criteria**:

- Recharts LineChart with two lines (nodes completed, study hours)
- X-axis: dates
- Y-axis: dual axis (nodes on left, hours on right)
- Gradient fill under lines
- Tooltips with formatted data
- Legend
- Date range selector (7 days, 30 days, 90 days, all time)
- Responsive design
- Loading state
- Empty state for no data

**Files Created**:

- `components/analytics/progress-chart.tsx`

---

### Task 12.5: Create Skills Radar Chart Component

**ID**: PLAC-095  
**Complexity**: Medium  
**Dependencies**: PLAC-091, PLAC-092

**Description**:
Build radar chart displaying skill proficiency levels.

**Acceptance Criteria**:

- Recharts RadarChart with skill proficiency data
- Shows top 8 skills
- Proficiency levels 1-10 on radial axis
- Gradient fill
- Interactive tooltips
- Skill selection to highlight
- Responsive design
- Loading state
- Empty state for no skills

**Files Created**:

- `components/analytics/skills-radar.tsx`

---

### Task 12.6: Create Activity Heatmap Component

**ID**: PLAC-096  
**Complexity**: High  
**Dependencies**: PLAC-005, PLAC-092

**Description**:
Build GitHub-style activity heatmap showing daily study activity.

**Acceptance Criteria**:

- Grid of squares representing days (last 365 days)
- Color intensity based on study hours
- Tooltips on hover showing date and hours
- Month labels
- Current week highlighted
- Responsive design
- Loading state
- Smooth animations

**Files Created**:

- `components/analytics/activity-heatmap.tsx`

---

### Task 12.7: Create Export Analytics Utility

**ID**: PLAC-097  
**Complexity**: Medium  
**Dependencies**: PLAC-092

**Description**:
Implement utility to export analytics data as PDF or CSV.

**Acceptance Criteria**:

- Export to CSV with all raw data
- Export to PDF with charts (using jspdf)
- Date range selection for export
- Include summary statistics
- Formatted output
- Download triggers automatically
- Error handling

**Files Created**:

- `lib/utils/export-analytics.ts`

**Files Modified**:

- `package.json` (install jspdf, jspdf-autotable)

---

### Task 12.8: Create Analytics Page

**ID**: PLAC-098  
**Complexity**: High  
**Dependencies**: PLAC-093, PLAC-094, PLAC-095, PLAC-096, PLAC-097

**Description**:
Build analytics page integrating all charts and metrics.

**Acceptance Criteria**:

- Metrics grid at top
- Progress chart below metrics
- Two-column layout: skills radar on left, heatmap on right
- Date range filter affects all charts
- Export button in header
- Loading states for all sections
- Error boundaries
- Responsive layout (stacks on mobile)
- Page metadata

**Files Created**:

- `app/(dashboard)/analytics/page.tsx`

---

## Phase 13: Company Preparation

### Task 13.1: Create Company List Component

**ID**: PLAC-099  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build searchable, filterable list of companies with cards.

**Acceptance Criteria**:

- Grid of company cards
- Search by company name
- Filter by industry
- Sort options (name, popularity)
- Company card shows: logo, name, industry, tech stack preview
- Click card to view details
- Loading skeletons
- Empty state for no results
- Pagination or infinite scroll
- Responsive grid

**Files Created**:

- `components/companies/company-list.tsx`
- `components/companies/company-card.tsx`

---

### Task 13.2: Create Company Details Component

**ID**: PLAC-100  
**Complexity**: High  
**Dependencies**: PLAC-005

**Description**:
Build comprehensive company details page with all preparation resources.

**Acceptance Criteria**:

- Company header with logo, name, website link
- Overview section (industry, size, description)
- Tech stack with badges
- Interview process timeline
- Common questions accordion (grouped by type)
- Coding patterns section
- Culture and values
- Salary range and benefits
- Bookmark company button
- Add to target companies button
- Share button
- Responsive layout

**Files Created**:

- `components/companies/company-details.tsx`
- `components/companies/preparation-resources.tsx`

---

### Task 13.3: Create Company Server Actions

**ID**: PLAC-101  
**Complexity**: Low  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement server actions for fetching company data and managing bookmarks.

**Acceptance Criteria**:

- getCompanies action with search and filtering
- getCompanyById action with full details
- bookmarkCompany action saves bookmark
- removeBookmark action removes bookmark
- getBookmarkedCompanies action for user
- All actions have error handling
- Caching for company data

**Files Created**:

- `lib/actions/companies.actions.ts`

---

### Task 13.4: Create Companies Pages

**ID**: PLAC-102  
**Complexity**: Medium  
**Dependencies**: PLAC-099, PLAC-100, PLAC-101

**Description**:
Build companies pages: list and individual company detail.

**Acceptance Criteria**:

- /companies page shows company list
- /companies/[id] page shows company details
- Server-side data fetching
- Loading states
- Error boundaries
- Page metadata with company name
- Responsive layouts
- Breadcrumb navigation

**Files Created**:

- `app/(dashboard)/companies/page.tsx`
- `app/(dashboard)/companies/[id]/page.tsx`

---

## Phase 14: Project Generator

### Task 14.1: Create Project Generation API Route

**ID**: PLAC-103  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047

**Description**:
Build API route that generates personalized project ideas using OpenAI.

**Acceptance Criteria**:

- POST /api/ai/project-generation endpoint
- Accepts target role, skills, difficulty preference
- Fetches user's target companies for tech stack alignment
- Generates 3-5 project ideas per request
- Each project includes: title, description, duration, difficulty, technologies, requirements, phases, evaluation criteria
- Projects relevant to target role and companies
- Structured JSON response
- Response time < 12 seconds
- Error handling

**Files Created**:

- `app/api/ai/project-generation/route.ts`

---

### Task 14.2: Create Project Card Component

**ID**: PLAC-104  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build project card displaying project summary with action buttons.

**Acceptance Criteria**:

- Project title and description (truncated)
- Difficulty badge
- Estimated duration
- Technology badges (top 3-4)
- Status indicator (suggested, in_progress, completed, dismissed)
- Action buttons (View Details, Start Project, Dismiss)
- Hover effects with glow
- Click to expand details
- Smooth animations

**Files Created**:

- `components/projects/project-card.tsx`

---

### Task 14.3: Create Project Details Component

**ID**: PLAC-105  
**Complexity**: High  
**Dependencies**: PLAC-005

**Description**:
Build detailed project view with requirements, phases, and tracking.

**Acceptance Criteria**:

- Full project description
- All technologies listed with icons
- Requirements checklist
- Implementation phases accordion
- Evaluation criteria section
- Progress tracker (if started)
- GitHub repo input
- Demo URL input
- Start/Complete project buttons
- Link to roadmap node (optional)
- Share project button
- Responsive layout

**Files Created**:

- `components/projects/project-details.tsx`

---

### Task 14.4: Create Project Generator Component

**ID**: PLAC-106  
**Complexity**: Medium  
**Dependencies**: PLAC-103, PLAC-005

**Description**:
Build UI for generating new project ideas with preferences.

**Acceptance Criteria**:

- Difficulty selector (beginner, intermediate, advanced)
- Specific technology preference (optional)
- Generate button
- Loading state with animation
- Generated projects display as cards
- Regenerate option
- Save selected projects
- Empty state with call to action

**Files Created**:

- `components/projects/project-generator.tsx`

---

### Task 14.5: Create Project List Component

**ID**: PLAC-107  
**Complexity**: Medium  
**Dependencies**: PLAC-104

**Description**:
Build filterable list of projects with status tabs.

**Acceptance Criteria**:

- Tabs for: All, Suggested, In Progress, Completed
- Filter by difficulty and technology
- Sort options (date, difficulty, status)
- Project cards in grid layout
- Empty state for each tab
- Loading skeletons
- Pagination or infinite scroll
- Responsive grid

**Files Created**:

- `components/projects/project-list.tsx`

---

### Task 14.6: Create Project Server Actions

**ID**: PLAC-108  
**Complexity**: Medium  
**Dependencies**: PLAC-011, PLAC-020

**Description**:
Implement server actions for project CRUD and status management.

**Acceptance Criteria**:

- createProject action saves generated project
- updateProject action for editing details
- updateProjectStatus action (suggested → in_progress → completed)
- dismissProject action
- getProjects action with filtering
- getProjectById action
- linkToRoadmapNode action
- All actions validate user ownership
- Error handling

**Files Created**:

- `lib/actions/projects.actions.ts`

---

### Task 14.7: Create Projects Pages

**ID**: PLAC-109  
**Complexity**: High  
**Dependencies**: PLAC-106, PLAC-107, PLAC-105, PLAC-108

**Description**:
Build projects pages: list with generator and individual project details.

**Acceptance Criteria**:

- /projects page shows project list and generator
- /projects/[id] page shows project details
- Generator button opens modal
- Server-side data fetching
- Loading states
- Error boundaries
- Page metadata
- Responsive layouts

**Files Created**:

- `app/(dashboard)/projects/page.tsx`
- `app/(dashboard)/projects/[id]/page.tsx`

---

## Phase 15: Settings and Profile

### Task 15.1: Create Profile Settings Component

**ID**: PLAC-110  
**Complexity**: Medium  
**Dependencies**: PLAC-005, PLAC-025

**Description**:
Build profile settings form for updating user information.

**Acceptance Criteria**:

- Full name input
- Email input (with verification if changed)
- Avatar upload with preview
- Current password required for changes
- Form validation
- Save button with loading state
- Success/error notifications
- Accessible form

**Files Created**:

- `components/settings/profile-settings.tsx`

---

### Task 15.2: Create Account Settings Component

**ID**: PLAC-111  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build account settings for password, connected accounts, and danger zone.

**Acceptance Criteria**:

- Change password section with old/new password inputs
- Connected OAuth accounts display
- Connect/disconnect OAuth buttons
- Delete account section with confirmation
- Data export request button
- Two-factor authentication toggle (future)
- Accessible form
- Confirmation dialogs for dangerous actions

**Files Created**:

- `components/settings/account-settings.tsx`

---

### Task 15.3: Create Notification Settings Component

**ID**: PLAC-112  
**Complexity**: Low  
**Dependencies**: PLAC-005

**Description**:
Build notification preferences with toggles for each type.

**Acceptance Criteria**:

- Toggle for email notifications
- Toggle for in-app notifications
- Toggle for task reminders
- Toggle for weekly review notifications
- Toggle for milestone notifications
- Email digest frequency selector (daily, weekly, never)
- Save button with loading state
- Changes saved to profile

**Files Created**:

- `components/settings/notification-settings.tsx`

---

### Task 15.4: Create Data Export Component

**ID**: PLAC-113  
**Complexity**: Medium  
**Dependencies**: PLAC-011

**Description**:
Build component for exporting user data in compliance with GDPR.

**Acceptance Criteria**:

- Request data export button
- Export includes: profile, target profile, skills, roadmap, tasks, interviews, resumes (metadata), projects
- Data exported as JSON file
- Privacy notice displayed
- Download triggers automatically
- Processing time notification
- Error handling

**Files Created**:

- `components/settings/data-export.tsx`

---

### Task 15.5: Create Settings Page

**ID**: PLAC-114  
**Complexity**: Medium  
**Dependencies**: PLAC-110, PLAC-111, PLAC-112, PLAC-113

**Description**:
Build settings page with tabs for different setting categories.

**Acceptance Criteria**:

- Tabs: Profile, Account, Notifications, Data & Privacy
- Tab content displays corresponding settings component
- Active tab highlighted
- Responsive layout (vertical tabs on mobile)
- Page metadata
- Unsaved changes warning
- Auto-save or explicit save per section

**Files Created**:

- `app/(dashboard)/settings/page.tsx`

---

## Phase 16: Real-time Features

### Task 16.1: Create Real-time Hooks

**ID**: PLAC-115  
**Complexity**: Medium  
**Dependencies**: PLAC-011, PLAC-045

**Description**:
Implement custom hooks for Supabase real-time subscriptions.

**Acceptance Criteria**:

- useRealtimeNotifications hook subscribes to notification inserts
- useRealtimeRoadmapUpdates hook subscribes to roadmap_nodes changes
- useRealtimeTasks hook subscribes to daily_tasks changes
- Automatic cleanup on unmount
- Error handling
- Reconnection logic
- Type-safe with TypeScript

**Files Created**:

- `lib/hooks/use-realtime.ts`

---

### Task 16.2: Integrate Real-time Updates

**ID**: PLAC-116  
**Complexity**: Medium  
**Dependencies**: PLAC-115

**Description**:
Integrate real-time subscriptions into relevant components for live updates.

**Acceptance Criteria**:

- Notification bell updates in real-time
- Roadmap nodes update when status changes (multi-device sync)
- Daily tasks update in real-time
- Toast notification on real-time update
- Smooth UI transitions
- No flash of content

**Files Modified**:

- `components/layouts/notification-bell.tsx`
- `components/roadmap/roadmap-canvas.tsx`
- `components/planner/task-list.tsx`

---

## Phase 17: Weekly Review System

### Task 17.1: Create Weekly Review Generation API

**ID**: PLAC-117  
**Complexity**: High  
**Dependencies**: PLAC-046, PLAC-047, PLAC-092

**Description**:
Build API route that generates AI-powered weekly progress review.

**Acceptance Criteria**:

- POST /api/ai/weekly-review endpoint
- Fetches user data for past week (nodes completed, hours logged, tasks, interviews)
- Calculates metrics (completion rate, progress %, week-over-week change)
- Sends data to OpenAI for analysis
- AI generates: top 3 strengths, top 3 improvements, recommendations, timeline adjustment
- Saves review to database
- Creates notification for user
- Response time < 15 seconds
- Error handling

**Files Created**:

- `app/api/ai/weekly-review/route.ts`

---

### Task 17.2: Create Cron Job for Weekly Reviews

**ID**: PLAC-118  
**Complexity**: Medium  
**Dependencies**: PLAC-117

**Description**:
Implement cron job API route that generates weekly reviews for all users.

**Acceptance Criteria**:

- GET /api/cron/weekly-reviews endpoint
- Protected with cron secret or Vercel Cron
- Fetches users who need reviews (7 days since last review or registration)
- Calls weekly review API for each user
- Batch processing with rate limiting
- Error handling and logging
- Success/failure tracking

**Files Created**:

- `app/api/cron/weekly-reviews/route.ts`

---

### Task 17.3: Configure Vercel Cron

**ID**: PLAC-119  
**Complexity**: Low  
**Dependencies**: PLAC-118

**Description**:
Configure Vercel cron job to run weekly review generation.

**Acceptance Criteria**:

- vercel.json configured with cron schedule
- Runs every Monday at 9:00 AM UTC
- Cron secret configured
- Error monitoring enabled
- Logs accessible

**Files Modified**:

- `vercel.json`

---

### Task 17.4: Create Weekly Review Display Component

**ID**: PLAC-120  
**Complexity**: Medium  
**Dependencies**: PLAC-005

**Description**:
Build component for displaying weekly review with charts and insights.

**Acceptance Criteria**:

- Review header with date range
- Metrics summary (hours, nodes, tasks completed)
- Progress chart showing week's activity
- Strengths section with icons
- Areas for improvement with icons
- Recommendations section
- Timeline adjustment notice (if needed)
- Week-over-week comparison
- Previous reviews navigation
- Share review button

**Files Created**:

- `components/dashboard/weekly-review.tsx`

---

### Task 17.5: Integrate Weekly Review into Dashboard

**ID**: PLAC-121  
**Complexity**: Low  
**Dependencies**: PLAC-120, PLAC-044

**Description**:
Add weekly review section to dashboard home page.

**Acceptance Criteria**:

- Latest review displayed in card
- "View Full Review" button opens modal
- Notification when new review available
- Historical reviews accessible
- Empty state if no reviews yet

**Files Modified**:

- `app/(dashboard)/dashboard/page.tsx`

---

## Phase 18: Search Functionality

### Task 18.1: Create Global Search API

**ID**: PLAC-122  
**Complexity**: High  
**Dependencies**: PLAC-011

**Description**:
Build API route for global search across all content types.

**Acceptance Criteria**:

- GET /api/search endpoint with query parameter
- Searches across: roadmap nodes, companies, projects, tasks
- Fuzzy matching support
- Relevance ranking based on target profile
- Returns results grouped by type
- Highlights matching text
- Response time < 500ms
- Pagination support
- Error handling

**Files Created**:

- `app/api/search/route.ts`

---

### Task 18.2: Create Search Results Component

**ID**: PLAC-123  
**Complexity**: Medium  
**Dependencies**: PLAC-122, PLAC-005

**Description**:
Build search results display with grouped results and filtering.

**Acceptance Criteria**:

- Results grouped by type (Roadmap, Companies, Projects, Tasks)
- Result items show: title, snippet with highlighted text, type icon
- Click result navigates to item
- Filter by content type
- Empty state for no results
- Loading state during search
- Keyboard navigation (arrow keys)
- Result count per type

**Files Created**:

- `components/shared/search-results.tsx`

---

### Task 18.3: Implement Search Modal

**ID**: PLAC-124  
**Complexity**: High  
**Dependencies**: PLAC-122, PLAC-123, PLAC-006

**Description**:
Build command palette-style search modal with keyboard shortcuts.

**Acceptance Criteria**:

- Modal opens with Cmd/Ctrl + K
- Search input auto-focused
- Real-time search as user types (debounced)
- ESC to close
- Enter to navigate to first result
- Arrow keys to navigate results
- Recent searches displayed when empty
- Search history saved locally
- Clear history option
- Accessible with ARIA

**Files Created**:

- `components/shared/search-modal.tsx`

---

### Task 18.4: Integrate Search into Layout

**ID**: PLAC-125  
**Complexity**: Low  
**Dependencies**: PLAC-124, PLAC-041

**Description**:
Add search button and keyboard shortcut listener to top bar.

**Acceptance Criteria**:

- Search button in top bar
- Keyboard shortcut listener (Cmd/Ctrl + K)
- Search modal renders when triggered
- Global keyboard event listener
- Works from any page

**Files Modified**:

- `components/layouts/top-bar.tsx`
- `app/(dashboard)/layout.tsx`

---

## Phase 19: Error Handling and Monitoring

### Task 19.1: Install and Configure Sentry

**ID**: PLAC-126  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Install Sentry for error tracking and performance monitoring.

**Acceptance Criteria**:

- @sentry/nextjs installed
- Sentry initialized in Next.js
- DSN configured in environment variables
- Source maps uploaded
- Performance monitoring enabled
- Session replay configured
- Error filtering (remove sensitive data)

**Files Created**:

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

**Files Modified**:

- `next.config.js`
- `.env.local`
- `package.json`

---

### Task 19.2: Create Error Boundary Components

**ID**: PLAC-127  
**Complexity**: Medium  
**Dependencies**: PLAC-126, PLAC-005

**Description**:
Build error boundary components for graceful error handling.

**Acceptance Criteria**:

- Root error boundary for app-wide errors
- Page-level error boundaries
- Component-level error boundaries for critical features
- Error UI with retry button
- Error logged to Sentry
- User-friendly error messages
- Reset error state functionality

**Files Created**:

- `components/shared/error-boundary.tsx`
- `app/error.tsx`
- `app/global-error.tsx`

---

### Task 19.3: Create Loading and Empty States

**ID**: PLAC-128  
**Complexity**: Low  
**Dependencies**: PLAC-005

**Description**:
Build reusable loading and empty state components.

**Acceptance Criteria**:

- Loading spinner component
- Skeleton components for different layouts
- Empty state component with icon, message, and action
- Page loading component
- Consistent styling across app
- Accessible with ARIA

**Files Created**:

- `components/shared/loading-spinner.tsx`
- `components/shared/empty-state.tsx`
- `components/shared/page-loading.tsx`

---

### Task 19.4: Implement Rate Limiting

**ID**: PLAC-129  
**Complexity**: Medium  
**Dependencies**: PLAC-001

**Description**:
Implement rate limiting for API routes to prevent abuse.

**Acceptance Criteria**:

- Install @upstash/ratelimit or similar
- Rate limit AI endpoints (10 requests per minute per user)
- Rate limit authentication endpoints (5 requests per minute per IP)
- Rate limit search (30 requests per minute per user)
- Return 429 status with retry-after header
- User-friendly error messages
- Bypass for development environment

**Files Created**:

- `lib/utils/rate-limit.ts`

**Files Modified**:

- API route files
- `package.json`

---

## Phase 20: Testing

### Task 20.1: Configure Testing Framework

**ID**: PLAC-130  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Set up Jest and React Testing Library for unit and integration tests.

**Acceptance Criteria**:

- jest and @testing-library/react installed
- jest.config.js configured
- Test setup file created
- Mock utilities for Supabase and OpenAI
- Test scripts in package.json
- Code coverage configured
- CI integration ready

**Files Created**:

- `jest.config.js`
- `jest.setup.js`
- `__tests__/setup.ts`
- `__mocks__/supabase.ts`
- `__mocks__/openai.ts`

**Files Modified**:

- `package.json`

---

### Task 20.2: Write UI Component Tests

**ID**: PLAC-131  
**Complexity**: Medium  
**Dependencies**: PLAC-130, PLAC-005

**Description**:
Write unit tests for all UI components in components/ui/.

**Acceptance Criteria**:

- Tests for Button (variants, loading, disabled, onClick)
- Tests for Input (validation, errors, onChange)
- Tests for Card (variants, hover, onClick)
- Tests for Modal (open/close, focus trap, ESC key)
- Tests for Toast (variants, auto-dismiss, actions)
- Minimum 80% code coverage for UI components
- All tests pass

**Files Created**:

- `__tests__/components/ui/button.test.tsx`
- `__tests__/components/ui/input.test.tsx`
- `__tests__/components/ui/card.test.tsx`
- `__tests__/components/ui/modal.test.tsx`
- `__tests__/components/ui/toast.test.tsx`

---

### Task 20.3: Write Integration Tests

**ID**: PLAC-132  
**Complexity**: High  
**Dependencies**: PLAC-130

**Description**:
Write integration tests for key user flows.

**Acceptance Criteria**:

- Authentication flow test (login, register, logout)
- Onboarding flow test (multi-step wizard)
- Roadmap interaction test (view, update node status)
- Task management test (create, update, delete)
- Minimum 70% code coverage for integration tests
- All tests pass
- Tests run in CI

**Files Created**:

- `__tests__/integration/auth.test.tsx`
- `__tests__/integration/onboarding.test.tsx`
- `__tests__/integration/roadmap.test.tsx`
- `__tests__/integration/tasks.test.tsx`

---

### Task 20.4: Configure E2E Testing with Playwright

**ID**: PLAC-133  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Set up Playwright for end-to-end testing.

**Acceptance Criteria**:

- @playwright/test installed
- playwright.config.ts configured
- Test browsers installed
- Base URL configured
- Test fixtures created
- Scripts in package.json
- CI integration ready

**Files Created**:

- `playwright.config.ts`
- `e2e/fixtures.ts`

**Files Modified**:

- `package.json`

---

### Task 20.5: Write E2E Tests

**ID**: PLAC-134  
**Complexity**: High  
**Dependencies**: PLAC-133

**Description**:
Write end-to-end tests for critical user journeys.

**Acceptance Criteria**:

- Full registration and onboarding flow
- Login and navigation test
- Roadmap generation and interaction
- Mock interview complete flow
- Resume upload and analysis
- All tests pass
- Tests run in CI with screenshots on failure

**Files Created**:

- `e2e/auth.spec.ts`
- `e2e/onboarding.spec.ts`
- `e2e/roadmap.spec.ts`
- `e2e/interview.spec.ts`
- `e2e/resume.spec.ts`

---

### Task 20.6: Write Accessibility Tests

**ID**: PLAC-135  
**Complexity**: Medium  
**Dependencies**: PLAC-130

**Description**:
Write automated accessibility tests using jest-axe.

**Acceptance Criteria**:

- jest-axe installed and configured
- Tests for all major components
- No critical accessibility violations
- Color contrast verified
- ARIA labels verified
- Keyboard navigation tested
- All tests pass

**Files Created**:

- `__tests__/accessibility/components.test.tsx`
- `__tests__/accessibility/pages.test.tsx`

**Files Modified**:

- `package.json`

---

## Phase 21: Performance Optimization

### Task 21.1: Implement Image Optimization

**ID**: PLAC-136  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Optimize all images using Next.js Image component and WebP format.

**Acceptance Criteria**:

- All images use next/image
- WebP format with fallbacks
- Responsive images with srcset
- Lazy loading enabled
- Proper sizing and quality settings
- Blur placeholders for above-the-fold images

**Files Modified**:

- All components using images

---

### Task 21.2: Optimize Bundle Size

**ID**: PLAC-137  
**Complexity**: Medium  
**Dependencies**: PLAC-001

**Description**:
Analyze and optimize JavaScript bundle size.

**Acceptance Criteria**:

- @next/bundle-analyzer installed
- Bundle analysis run and reviewed
- Dynamic imports for heavy components (React Flow, Recharts)
- Tree shaking verified
- Unused dependencies removed
- Total bundle size < 300KB (gzipped)
- First Load JS < 100KB

**Files Modified**:

- `next.config.js`
- `package.json`
- Component files with dynamic imports

---

### Task 21.3: Implement Caching Strategy

**ID**: PLAC-138  
**Complexity**: Medium  
**Dependencies**: PLAC-011

**Description**:
Implement caching for frequently accessed data.

**Acceptance Criteria**:

- Next.js route caching configured
- Supabase queries with revalidation tags
- Static data (companies) cached longer
- User data cached with shorter TTL
- Cache invalidation on mutations
- Redis/Upstash for API response caching (optional)

**Files Modified**:

- Server action files
- API route files

---

### Task 21.4: Run Lighthouse Audits

**ID**: PLAC-139  
**Complexity**: Low  
**Dependencies**: PLAC-136, PLAC-137, PLAC-138

**Description**:
Run Lighthouse audits and optimize for Core Web Vitals.

**Acceptance Criteria**:

- Lighthouse performance score > 90 (desktop)
- Lighthouse performance score > 80 (mobile)
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.8s
- Cumulative Layout Shift < 0.1
- All best practices followed
- Accessibility score 100
- SEO score 100

---

## Phase 22: Documentation and Polish

### Task 22.1: Create README Documentation

**ID**: PLAC-140  
**Complexity**: Low  
**Dependencies**: None

**Description**:
Write comprehensive README with setup instructions and architecture overview.

**Acceptance Criteria**:

- Project overview and features
- Tech stack listed
- Prerequisites
- Installation instructions
- Environment variables documented
- Development commands
- Testing instructions
- Deployment instructions
- Architecture diagram
- Contributing guidelines

**Files Created**:

- `README.md`
- `CONTRIBUTING.md`

---

### Task 22.2: Add Code Comments and Documentation

**ID**: PLAC-141  
**Complexity**: Low  
**Dependencies**: All previous tasks

**Description**:
Add JSDoc comments to all functions, components, and utilities.

**Acceptance Criteria**:

- All exported functions have JSDoc comments
- All components have description comments
- Complex logic has inline comments
- Type definitions documented
- Examples included where helpful
- Generated API documentation using TypeDoc

**Files Modified**:

- All source files

---

### Task 22.3: Create User Guide

**ID**: PLAC-142  
**Complexity**: Low  
**Dependencies**: None

**Description**:
Write user-facing documentation explaining features and workflows.

**Acceptance Criteria**:

- Getting started guide
- Feature walkthroughs
- FAQ section
- Troubleshooting guide
- Screenshots and GIFs
- Hosted on GitHub wiki or separate docs site

**Files Created**:

- `docs/user-guide.md`
- `docs/faq.md`
- `docs/troubleshooting.md`

---

### Task 22.4: Polish UI and Animations

**ID**: PLAC-143  
**Complexity**: Medium  
**Dependencies**: All UI tasks

**Description**:
Final polish pass on all UI components and animations for consistency and smoothness.

**Acceptance Criteria**:

- All animations smooth (60fps)
- Consistent timing functions across app
- No janky transitions
- Loading states everywhere
- Hover states consistent
- Focus states visible
- Color palette consistent
- Typography consistent
- Spacing consistent
- Mobile interactions optimized

**Files Modified**:

- All component files

---

### Task 22.5: Add Meta Tags and SEO

**ID**: PLAC-144  
**Complexity**: Low  
**Dependencies**: All page tasks

**Description**:
Add proper meta tags, Open Graph, and Twitter cards for all pages.

**Acceptance Criteria**:

- Every page has unique title
- Every page has meta description
- Open Graph tags for social sharing
- Twitter card tags
- Favicon and app icons
- robots.txt configured
- sitemap.xml generated
- Schema.org structured data

**Files Created**:

- `public/robots.txt`
- `public/sitemap.xml`
- `app/manifest.ts`

**Files Modified**:

- All page files with metadata

---

## Phase 23: Deployment and CI/CD

### Task 23.1: Configure GitHub Actions CI/CD

**ID**: PLAC-145  
**Complexity**: Medium  
**Dependencies**: PLAC-130, PLAC-133

**Description**:
Set up GitHub Actions workflow for automated testing and deployment.

**Acceptance Criteria**:

- Workflow runs on push to main and develop
- Workflow runs on pull requests
- Linting step
- Type checking step
- Unit tests step
- Integration tests step
- E2E tests step
- Build step
- Code coverage upload
- Deploy to Vercel on success
- Notifications on failure

**Files Created**:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

---

### Task 23.2: Configure Vercel Project

**ID**: PLAC-146  
**Complexity**: Low  
**Dependencies**: PLAC-001

**Description**:
Set up Vercel project with environment variables and deployment settings.

**Acceptance Criteria**:

- Vercel project created
- GitHub repository connected
- Environment variables configured (production, preview)
- Custom domain configured (optional)
- Edge functions enabled
- Analytics enabled
- Preview deployments for PRs
- Production deployment on main branch

**Files Created**:

- `vercel.json`

---

### Task 23.3: Set Up Database Migrations for Production

**ID**: PLAC-147  
**Complexity**: Medium  
**Dependencies**: PLAC-019

**Description**:
Prepare and run database migrations on production Supabase instance.

**Acceptance Criteria**:

- Production Supabase project created
- All migrations tested on staging
- Migrations run on production
- Database backed up before migration
- RLS policies verified
- Seed data added
- Connection from Vercel verified
- Environment variables updated

---

### Task 23.4: Configure Production Environment Variables

**ID**: PLAC-148  
**Complexity**: Low  
**Dependencies**: PLAC-146, PLAC-147

**Description**:
Set all required environment variables in Vercel production environment.

**Acceptance Criteria**:

- NEXT_PUBLIC_SUPABASE_URL (production)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (production)
- SUPABASE_SERVICE_ROLE_KEY (production)
- OPENAI_API_KEY
- OPENAI_ORGANIZATION_ID
- NEXT_PUBLIC_APP_URL (production domain)
- SENTRY_DSN
- All secrets encrypted
- Variables synced to preview environments

**Files Modified**:

- Vercel project settings

---

### Task 23.5: Deploy to Production

**ID**: PLAC-149  
**Complexity**: Low  
**Dependencies**: PLAC-145, PLAC-146, PLAC-147, PLAC-148

**Description**:
Deploy application to Vercel production environment.

**Acceptance Criteria**:

- Build successful
- All tests passing
- Application accessible at production URL
- Database connections working
- Authentication working
- AI features working
- No console errors
- Monitoring active
- Logs accessible
- Performance metrics tracked

---

### Task 23.6: Set Up Monitoring and Alerts

**ID**: PLAC-150  
**Complexity**: Low  
**Dependencies**: PLAC-126, PLAC-149

**Description**:
Configure monitoring dashboards and error alerts.

**Acceptance Criteria**:

- Sentry alerts configured (error rate, performance)
- Vercel analytics active
- Supabase monitoring enabled
- OpenAI usage tracking
- Uptime monitoring (UptimeRobot or similar)
- Slack/email notifications on critical errors
- Performance budget alerts
- Database performance monitoring

---

## Phase 24: Post-Launch

### Task 24.1: Create Feedback Collection System

**ID**: PLAC-151  
**Complexity**: Low  
**Dependencies**: PLAC-005

**Description**:
Add feedback widget for users to submit feedback and bug reports.

**Acceptance Criteria**:

- Feedback button accessible from all pages
- Form with: feedback type, description, screenshot capture
- Submissions saved to database
- Email notification to team
- User receives confirmation
- Dashboard to view feedback (admin)

**Files Created**:

- `components/shared/feedback-widget.tsx`
- `app/api/feedback/route.ts`

---

### Task 24.2: Implement Analytics Tracking

**ID**: PLAC-152  
**Complexity**: Low  
**Dependencies**: PLAC-149

**Description**:
Add privacy-compliant analytics for understanding user behavior.

**Acceptance Criteria**:

- Analytics library integrated (Vercel Analytics or Plausible)
- Page views tracked
- User events tracked (signup, roadmap generation, interview completion)
- Privacy-friendly (no personal data)
- Cookie consent implemented
- GDPR compliant
- Dashboard accessible

**Files Created**:

- `components/shared/cookie-consent.tsx`
- `lib/analytics/tracking.ts`

**Files Modified**:

- `app/layout.tsx`

---

### Task 24.3: Create Terms of Service and Privacy Policy

**ID**: PLAC-153  
**Complexity**: Low  
**Dependencies**: None

**Description**:
Draft legal documents for terms of service and privacy policy.

**Acceptance Criteria**:

- Terms of Service written
- Privacy Policy written (GDPR compliant)
- Cookie Policy written
- Pages created for each document
- Links in footer
- Acceptance required during signup
- Last updated date displayed

**Files Created**:

- `app/(legal)/terms/page.tsx`
- `app/(legal)/privacy/page.tsx`
- `app/(legal)/cookies/page.tsx`
- `app/(legal)/layout.tsx`

---

### Task 24.4: Optimize for Mobile Experience

**ID**: PLAC-154  
**Complexity**: Medium  
**Dependencies**: PLAC-143

**Description**:
Final optimization pass specifically for mobile devices.

**Acceptance Criteria**:

- Touch targets minimum 44px
- Swipe gestures where appropriate
- Bottom navigation accessible
- Forms work with virtual keyboard
- No horizontal scroll
- Fast tap response (no 300ms delay)
- Install as PWA support
- Offline capability for basic features
- Mobile performance score > 80

**Files Modified**:

- All component files
- `app/manifest.ts`

---

### Task 24.5: Create Admin Dashboard (Optional)

**ID**: PLAC-155  
**Complexity**: High  
**Dependencies**: PLAC-149

**Description**:
Build basic admin dashboard for monitoring platform usage and managing content.

**Acceptance Criteria**:

- Admin-only route protection
- User statistics (total users, active users, retention)
- Usage metrics (roadmaps generated, interviews conducted)
- Content management (companies, seed data)
- Feedback viewer
- Error log viewer
- OpenAI usage tracker
- Database health dashboard

**Files Created**:

- `app/(admin)/admin/page.tsx`
- `app/(admin)/layout.tsx`
- `components/admin/` directory with components

---

## Summary

**Total Tasks**: 155  
**Estimated Timeline**: 12-16 weeks for a team of 2-3 developers

**Implementation Order**:

1. **Phase 1-2**: Foundation and Database (2 weeks)
2. **Phase 3-4**: Authentication and Onboarding (1.5 weeks)
3. **Phase 5-6**: Dashboard and OpenAI Setup (1 week)
4. **Phase 7**: Roadmap System (2 weeks)
5. **Phase 8-9**: AI Features (Interview, Mentor) (2 weeks)
6. **Phase 10-14**: Core Features (Resume, Planner, Analytics, Companies, Projects) (3 weeks)
7. **Phase 15-19**: Polish and Infrastructure (2 weeks)
8. **Phase 20-21**: Testing and Optimization (2 weeks)
9. **Phase 22-24**: Documentation, Deployment, Post-Launch (1.5 weeks)

**Key Milestones**:

- ✅ Week 2: Database and authentication working
- ✅ Week 4: Onboarding flow and first AI roadmap generation
- ✅ Week 6: Complete roadmap visualization
- ✅ Week 8: AI mentor and mock interviews functional
- ✅ Week 10: All core features implemented
- ✅ Week 12: Testing complete, ready for staging
- ✅ Week 14: Production deployment with monitoring

---

_Note: This task breakdown assumes a small team working full-time. Individual task estimates may vary. Some tasks can be parallelized when multiple developers are available._
