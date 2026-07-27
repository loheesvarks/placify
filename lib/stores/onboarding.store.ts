import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { OnboardingData, OnboardingStepId } from '@/lib/types/onboarding';

interface OnboardingState {
  currentStep: OnboardingStepId;
  data: Partial<OnboardingData>;
  isCompleted: boolean;
}

interface OnboardingActions {
  setCurrentStep: (step: OnboardingStepId) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
  markCompleted: () => void;
}

type OnboardingStore = OnboardingState & OnboardingActions;

const initialState: OnboardingState = {
  currentStep: 1,
  data: {
    currency: 'INR', // Default currency
    currentSkills: [],
    preferredTechStack: [],
    learningGoals: [],
  },
  isCompleted: false,
};

/**
 * Zustand store for onboarding state
 * Persisted to localStorage for draft auto-save
 */
export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentStep: (step) =>
        set(() => ({
          currentStep: step,
        })),

      updateData: (newData) =>
        set((state) => ({
          data: {
            ...state.data,
            ...newData,
          },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 10) as OnboardingStepId,
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1) as OnboardingStepId,
        })),

      reset: () =>
        set(() => ({
          ...initialState,
        })),

      markCompleted: () =>
        set(() => ({
          isCompleted: true,
        })),
    }),
    {
      name: 'placify-onboarding-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist everything except completion status
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
      }),
    }
  )
);
