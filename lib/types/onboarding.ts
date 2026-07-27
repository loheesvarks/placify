/**
 * Onboarding types and interfaces
 * Defines the structure for the multi-step onboarding flow
 */

export interface OnboardingData {
  // Personal Information (Step 2)
  fullName: string;
  college: string;
  degree: string;
  department: string;
  
  // Education (Step 3)
  currentYear: number;
  graduationYear: number;
  
  // Career Goal (Step 4)
  preferredRole: string;
  
  // Target Package (Step 5)
  targetPackageMin: number;
  targetPackageMax: number;
  currency: string;
  
  // Technology Interests (Step 6)
  preferredTechStack: string[];
  
  // Current Skills (Step 7)
  currentSkills: OnboardingSkill[];
  
  // Learning Preferences (Step 8)
  weeklyStudyHours: number;
  learningGoals: string[];
}

export interface OnboardingSkill {
  name: string;
  proficiency: number; // 1-10
  category: 'technical' | 'soft' | 'domain';
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

export type OnboardingStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome',
    description: 'Get started with Placify',
  },
  {
    id: 2,
    title: 'Personal Information',
    description: 'Tell us about yourself',
  },
  {
    id: 3,
    title: 'Education',
    description: 'Your academic background',
  },
  {
    id: 4,
    title: 'Career Goal',
    description: 'What role are you targeting?',
  },
  {
    id: 5,
    title: 'Target Package',
    description: 'Your salary expectations',
  },
  {
    id: 6,
    title: 'Technology Interests',
    description: 'Technologies you want to work with',
  },
  {
    id: 7,
    title: 'Current Skills',
    description: 'Assess your current skillset',
  },
  {
    id: 8,
    title: 'Learning Preferences',
    description: 'How do you want to learn?',
  },
  {
    id: 9,
    title: 'Review',
    description: 'Review your information',
  },
  {
    id: 10,
    title: 'Finish',
    description: 'Complete your profile',
  },
];
