# Placify Architecture Documentation

## Overview

This document describes the architectural foundations of Placify, establishing clean patterns for scalable development.

## Project Structure

```
placify/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── (onboarding)/      # Onboarding routes
│   └── ...
├── components/            # React components
│   ├── auth/             # Auth-specific components
│   ├── onboarding/       # Onboarding-specific components
│   └── ui/               # Reusable UI components
├── lib/                   # Core application logic
│   ├── actions/          # Server actions
│   ├── animations/       # Animation utilities
│   ├── config/           # Configuration files
│   ├── constants/        # Application constants
│   ├── hooks/            # React custom hooks
│   ├── services/         # Service layer (business logic)
│   ├── stores/           # Zustand state stores
│   ├── supabase/         # Supabase client utilities
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── validations/      # Zod validation schemas
└── docs/                  # Documentation
```

## Architecture Layers

### Layer 1: Data Layer
**Location:** `lib/supabase/`, `lib/actions/`

**Responsibilities:**
- Direct database interactions
- Supabase client configuration
- Server actions for data mutations
- Raw data fetching

**Rules:**
- Never import from upper layers (components, hooks, services)
- Focus on data operations only
- Handle errors at the data layer
- Return consistent response formats

### Layer 2: Service Layer
**Location:** `lib/services/`

**Responsibilities:**
- Business logic implementation
- Orchestration of multiple data operations
- Data transformation and validation
- Error handling and logging

**Rules:**
- Services call Data Layer (actions, Supabase)
- Services do NOT import from Hooks or Components
- Each service handles one domain (auth, dashboard, etc.)
- Services return typed responses
- Services are framework-agnostic

**Dependency Direction:**
```
Service → Server Action → Supabase
Service → Supabase Client
```

### Layer 3: State Management Layer
**Location:** `lib/stores/`

**Responsibilities:**
- Application state management (Zustand)
- Client-side state persistence
- State update logic
- State selectors

**Rules:**
- Stores manage state, not business logic
- Stores can be accessed by hooks and components
- Keep stores focused on their domain
- Use persistence middleware for user preferences

### Layer 4: Hook Layer
**Location:** `lib/hooks/`

**Responsibilities:**
- React-specific logic
- State access patterns
- Side effect management
- Reusable component logic

**Rules:**
- Hooks access Services and Stores
- Hooks do NOT directly call Server Actions
- Hooks provide clean interfaces to components
- Name hooks with `use` prefix

**Dependency Direction:**
```
Hook → Service → Server Action
Hook → Store
```

### Layer 5: Component Layer
**Location:** `components/`, `app/`

**Responsibilities:**
- UI rendering
- User interaction handling
- Presentation logic
- Component composition

**Rules:**
- Components use Hooks for data and logic
- Components do NOT directly import Services or Actions
- Keep components focused and composable
- Separate presentational and container components

**Dependency Direction:**
```
Component → Hook → Service/Store → Server Action → Supabase
```

## Complete Dependency Flow

```
┌─────────────┐
│  Component  │ (Presentation)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Hook     │ (React Logic)
└──────┬──────┘
       │
    ┌──┴──┐
    ▼     ▼
┌────────┬────────┐
│ Store  │ Service│ (State & Business Logic)
└────────┴───┬────┘
             │
             ▼
     ┌───────────────┐
     │ Server Action │ (Data Operations)
     └───────┬───────┘
             │
             ▼
     ┌───────────────┐
     │   Supabase    │ (Database)
     └───────────────┘
```

## Folder Responsibilities

### `/lib/constants/`
Immutable application constants:
- Routes and navigation paths
- Animation timings and easings
- Responsive breakpoints
- Spacing scale
- Z-index layers

**Do NOT put here:** Environment variables, dynamic values, API endpoints

### `/lib/config/`
Application configuration:
- Site metadata
- Navigation structure
- Theme configuration
- Environment variable access

**Do NOT put here:** Business logic, data transformations

### `/lib/stores/`
Zustand state management:
- Application state (auth, theme, sidebar, etc.)
- State mutations
- Persistence logic

**Do NOT put here:** Business logic, API calls, data fetching

### `/lib/hooks/`
React custom hooks:
- State access patterns
- Side effects (useEffect)
- Reusable component logic
- Event handlers

**Do NOT put here:** Components, business logic, direct API calls

### `/lib/services/`
Service layer (business logic):
- Domain-specific operations
- Multi-step workflows
- Data transformation
- Error handling

**Do NOT put here:** React hooks, components, state management

### `/lib/actions/`
Next.js server actions:
- Database operations
- Supabase queries and mutations
- Server-side validation

**Do NOT put here:** Client-side logic, hooks, components

### `/lib/types/`
TypeScript type definitions:
- Database types (auto-generated)
- Domain models
- Shared interfaces
- API types

**Do NOT put here:** Runtime code, default values

### `/lib/utils/`
Pure utility functions:
- String manipulation
- Date formatting
- CSS class merging
- Helper functions

**Do NOT put here:** Business logic, stateful operations

### `/lib/validations/`
Zod validation schemas:
- Form validation
- API request validation
- Data structure validation

**Do NOT put here:** Business logic, transformations

## Naming Conventions

### Files
- **Components:** PascalCase (`AuthCard.tsx`, `LoginForm.tsx`)
- **Hooks:** kebab-case with `use-` prefix (`use-auth.ts`, `use-sidebar.ts`)
- **Services:** kebab-case with `.service` suffix (`auth.service.ts`)
- **Stores:** kebab-case with `.store` suffix (`auth.store.ts`)
- **Types:** kebab-case with `.types` suffix (`database.types.ts`)
- **Constants:** kebab-case (`routes.ts`, `animation.ts`)
- **Utils:** kebab-case (`cn.ts`, `format-date.ts`)

### Exports
- **Named exports** for utilities, hooks, services
- **Default exports** for page components only
- Use barrel exports (`index.ts`) for clean imports

### Variables and Functions
- **camelCase** for variables and functions
- **PascalCase** for types, interfaces, and classes
- **UPPER_SNAKE_CASE** for constants

## Import Patterns

### Preferred Import Style
```typescript
// Good: Barrel imports
import { ROUTES, ANIMATION_DURATION } from '@/lib/constants';
import { useAuth, useUser } from '@/lib/hooks';
import { authService } from '@/lib/services';

// Avoid: Direct file imports when barrel exists
import { ROUTES } from '@/lib/constants/routes';
```

### Import Order
1. External packages (React, Next.js, etc.)
2. Internal absolute imports (`@/lib/...`)
3. Relative imports (`./`, `../`)
4. Type imports (use `import type` when possible)

### Avoid Circular Dependencies
- Never import from a higher layer to a lower layer
- Use dependency injection for complex dependencies
- Extract shared types to separate files

## Migration Strategy

### Current Status (PLAC-011A)
✅ Architecture foundations established
✅ Constants, config, stores, hooks, services created
✅ Type definitions added
⏳ **Migration to new architecture NOT yet started**

### Future Migration Steps (PLAC-011B and beyond)

1. **Identify migration candidates**
   - Start with new features
   - Gradually refactor existing components

2. **Component migration pattern**
   ```typescript
   // Before (direct action import)
   import { signIn } from '@/lib/actions/auth.actions';
   
   // After (through hook → service)
   import { useAuth } from '@/lib/hooks';
   const { signIn } = useAuth();
   ```

3. **Service integration pattern**
   - Connect services to existing server actions
   - Maintain backward compatibility
   - Test thoroughly before removing old patterns

4. **Gradual adoption**
   - New code follows new architecture
   - Existing code remains functional
   - Refactor incrementally during feature work

## Key Principles

1. **Separation of Concerns**
   - Each layer has a single, well-defined responsibility
   - No layer skipping (components → hooks → services → actions)

2. **Unidirectional Data Flow**
   - Data flows down: Component ← Hook ← Service ← Action ← Database
   - Actions flow up: User interaction → Component → Hook → Service → Action

3. **Type Safety**
   - All layer boundaries are typed
   - Use TypeScript strict mode
   - Prefer interfaces over type aliases for object shapes

4. **Testability**
   - Each layer can be tested in isolation
   - Services are framework-agnostic
   - Hooks contain React-specific logic

5. **Backward Compatibility**
   - All changes are additive
   - Existing code continues to work
   - Migration happens incrementally

## Common Patterns

### Fetching Data in Components
```typescript
// Component
function DashboardPage() {
  const { data, isLoading } = useDashboard();
  
  if (isLoading) return <Spinner />;
  return <DashboardView data={data} />;
}

// Hook
function useDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    dashboardService.getData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, isLoading };
}

// Service
async function getData() {
  return await getDashboardData(); // Server action
}
```

### Managing Form State
```typescript
// Component
function LoginForm() {
  const { signIn, isLoading } = useAuth();
  
  const onSubmit = async (data) => {
    await signIn(data.email, data.password);
  };
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}

// Hook
function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  
  const signIn = async (email, password) => {
    const result = await authService.signIn(email, password);
    if (result.success) setUser(result.data.user);
  };
  
  return { signIn };
}
```

## Anti-Patterns to Avoid

❌ **Component calling Server Action directly**
```typescript
// Bad
import { signIn } from '@/lib/actions/auth.actions';
const result = await signIn(email, password);
```

❌ **Hook containing business logic**
```typescript
// Bad
function useAuth() {
  const signIn = async (email, password) => {
    // Complex validation logic here (should be in service)
    // Multiple API calls here (should be in service)
  };
}
```

❌ **Service importing React hooks**
```typescript
// Bad
import { useState } from 'react';
class AuthService {
  // Services should be framework-agnostic
}
```

❌ **Store containing business logic**
```typescript
// Bad
export const useAuthStore = create((set) => ({
  signIn: async (email, password) => {
    // Complex logic here (should be in service)
  }
}));
```

## Future Enhancements

- [ ] API route architecture
- [ ] Real-time data patterns (Supabase subscriptions)
- [ ] Caching strategy
- [ ] Error boundary patterns
- [ ] Loading state management
- [ ] Form validation patterns
- [ ] Testing guidelines per layer

## Questions or Issues?

When in doubt:
1. Check which layer you're working in
2. Follow the dependency direction (never import from upper layers)
3. Keep each layer focused on its responsibility
4. Prefer composition over complexity

---

**Document Status:** Living document  
**Last Updated:** PLAC-011A  
**Next Review:** PLAC-011B (Service Integration)
