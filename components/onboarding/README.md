# Onboarding Flow Components

This directory contains all components for the comprehensive onboarding flow (PLAC-010).

## Overview

The onboarding flow consists of 10 steps that collect user information to create a personalized learning experience:

1. **Welcome** - Introduction to Placify
2. **Personal Information** - Name, college, degree, department
3. **Education** - Current year, graduation year
4. **Career Goal** - Target role selection
5. **Target Package** - Salary expectations
6. **Technology Interests** - Preferred tech stack (1-15 technologies)
7. **Current Skills** - Skill assessment with proficiency levels (3-20 skills)
8. **Learning Preferences** - Weekly study hours and learning goals
9. **Review** - Summary of all entered information with edit capability
10. **Completion** - Success screen with redirect to dashboard

## Components

### OnboardingWizard
Main orchestrator component that manages step navigation, data persistence, and submission.

**Features:**
- Auto-save to localStorage via Zustand persist middleware
- Progress bar showing current step
- Smooth animations between steps
- Form validation at each step
- Error handling and toast notifications

### Individual Step Components

Each step component follows a consistent pattern:
- Receives `defaultValues`, `onNext`, and `onBack` props
- Uses React Hook Form with Zod validation
- Implements accessibility features (ARIA labels, keyboard navigation)
- Uses Framer Motion animations
- Follows the design system

## Data Flow

```
User Input → Form Validation → Local State Update → Zustand Store → LocalStorage
                                                                    ↓
                                                              (On completion)
                                                                    ↓
                                                        Server Action → Database
```

## Database Schema

The onboarding data is stored across multiple tables:

- **profiles** - Basic profile info, onboarding status, metadata
- **target_profiles** - Career goals, package expectations, timeline
- **skills** - User skills with proficiency levels

## Validation

All forms use Zod schemas defined in `lib/validations/onboarding.ts`:
- Step-wise validation ensures data quality
- Custom validation rules for package ranges, proficiency levels, etc.
- User-friendly error messages

## Accessibility

All components follow WCAG 2.1 AA standards:
- Proper heading hierarchy
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Error messages announced to assistive technologies

## Animations

Uses Framer Motion with variants from `lib/animations`:
- Fade in/up for step transitions
- Stagger animations for grids and lists
- Scale animations for buttons and icons
- Smooth page transitions

## Usage

```tsx
import { OnboardingWizard } from '@/components/onboarding';

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
```

## Testing Checklist

- [ ] All steps can be navigated forward and backward
- [ ] Form validation works correctly at each step
- [ ] Data persists across page refreshes
- [ ] Review step shows all entered data
- [ ] Edit functionality works from review step
- [ ] Submission saves data to database
- [ ] Redirect to dashboard after completion
- [ ] Loading states display correctly
- [ ] Error handling works for failed submissions
- [ ] Toast notifications appear appropriately
- [ ] Keyboard navigation works
- [ ] Screen readers can navigate the flow
- [ ] Mobile responsive design works
- [ ] Animations respect prefers-reduced-motion

## Future Enhancements

- Company selection (multi-select)
- Profile picture upload
- Import skills from LinkedIn
- Resume upload during onboarding
- Skip and complete later option with reminders
- Onboarding progress email notifications
