'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/lib/hooks/use-toast';
import { useOnboardingStore } from '@/lib/stores/onboarding.store';
import { completeOnboarding } from '@/lib/actions/onboarding.actions';
import { ONBOARDING_STEPS, type OnboardingStepId } from '@/lib/types/onboarding';
import { WelcomeStep } from './welcome-step';
import { PersonalInfoStep } from './personal-info-step';
import { EducationStep } from './education-step';
import { CareerGoalStep } from './career-goal-step';
import { TargetPackageStep } from './target-package-step';
import { TechnologyInterestsStep } from './technology-interests-step';
import { CurrentSkillsStep } from './current-skills-step';
import { LearningPreferencesStep } from './learning-preferences-step';
import { ReviewStep } from './review-step';
import { CompletionStep } from './completion-step';
import { fadeInUp } from '@/lib/animations';

export function OnboardingWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStep, data, setCurrentStep, updateData, nextStep, previousStep, reset } =
    useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    // Data is already persisted via Zustand persist middleware
  }, [data]);

  const handleNext = () => {
    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    previousStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepData = (stepData: Partial<typeof data>) => {
    updateData(stepData);
    handleNext();
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step as OnboardingStepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);

      // Validate all required data is present
      if (
        !data.fullName ||
        !data.college ||
        !data.degree ||
        !data.department ||
        !data.currentYear ||
        !data.graduationYear ||
        !data.preferredRole ||
        !data.targetPackageMin ||
        !data.targetPackageMax ||
        !data.currency ||
        !data.preferredTechStack ||
        data.preferredTechStack.length === 0 ||
        !data.currentSkills ||
        data.currentSkills.length === 0 ||
        !data.weeklyStudyHours ||
        !data.learningGoals ||
        data.learningGoals.length === 0
      ) {
        toast({
          title: 'Incomplete Data',
          description: 'Please complete all steps before submitting.',
          variant: 'error',
        });
        setIsSubmitting(false);
        return;
      }

      // Submit onboarding data
      const result = await completeOnboarding({
        fullName: data.fullName,
        college: data.college,
        degree: data.degree,
        department: data.department,
        currentYear: data.currentYear,
        graduationYear: data.graduationYear,
        preferredRole: data.preferredRole,
        targetPackageMin: data.targetPackageMin,
        targetPackageMax: data.targetPackageMax,
        currency: data.currency,
        preferredTechStack: data.preferredTechStack,
        currentSkills: data.currentSkills,
        weeklyStudyHours: data.weeklyStudyHours,
        learningGoals: data.learningGoals,
      });

      if (result.success) {
        // Clear onboarding storage
        reset();

        // Show success message
        toast({
          title: 'Onboarding Complete! 🎉',
          description: 'Welcome to Placify. Setting up your dashboard...',
          variant: 'success',
        });

        // Navigate to completion step
        handleNext();

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to complete onboarding',
        variant: 'error',
      });
      setIsSubmitting(false);
    }
  };

  const handleCompletionNext = () => {
    router.push('/dashboard');
    router.refresh();
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen w-full">
      {/* Progress Bar */}
      {currentStep > 1 && currentStep < 10 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-0 right-0 top-0 z-50 bg-surface-background/80 backdrop-blur-md"
        >
          <div className="mx-auto max-w-4xl px-4 py-4">
            <div className="mb-2 flex items-center justify-between text-body-sm">
              <span className="text-text-secondary">
                Step {currentStep - 1} of {ONBOARDING_STEPS.length - 2}
              </span>
              <span className="text-text-tertiary">
                {ONBOARDING_STEPS[currentStep - 1]?.title}
              </span>
            </div>
            <Progress value={progressPercentage} variant="primary" />
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div
        className={`mx-auto flex min-h-screen items-center justify-center px-4 ${currentStep > 1 && currentStep < 10 ? 'pt-24' : 'py-12'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            {currentStep === 1 && <WelcomeStep onNext={handleNext} />}

            {currentStep === 2 && (
              <PersonalInfoStep
                defaultValues={{
                  fullName: data.fullName,
                  college: data.college,
                  degree: data.degree,
                  department: data.department,
                }}
                onNext={handleStepData}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <EducationStep
                defaultValues={{
                  currentYear: data.currentYear,
                  graduationYear: data.graduationYear,
                }}
                onNext={handleStepData}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <CareerGoalStep
                defaultValues={{
                  preferredRole: data.preferredRole,
                }}
                onNext={handleStepData}
                onBack={handleBack}
              />
            )}

            {currentStep === 5 && (
              <TargetPackageStep
                defaultValues={{
                  targetPackageMin: data.targetPackageMin,
                  targetPackageMax: data.targetPackageMax,
                  currency: data.currency,
                }}
                onNext={handleStepData}
                onBack={handleBack}
              />
            )}

            {currentStep === 6 && (
              <TechnologyInterestsStep
                defaultValues={{
                  preferredTechStack: data.preferredTechStack,
                }}
                onNext={handleStepData}
                onBack={handleBack}
              />
            )}

            {currentStep === 7 && (
              <CurrentSkillsStep
                defaultValues={{
                  currentSkills: data.currentSkills,
                }}
                onNext={handleStepData}
                onBack={handleBack}
              />
            )}

            {currentStep === 8 && (
              <LearningPreferencesStep
                defaultValues={{
                  weeklyStudyHours: data.weeklyStudyHours,
                  learningGoals: data.learningGoals,
                }}
                onNext={handleStepData}
                onBack={handleBack}
              />
            )}

            {currentStep === 9 && (
              <ReviewStep
                data={data}
                onNext={handleComplete}
                onBack={handleBack}
                onEdit={handleEditStep}
              />
            )}

            {currentStep === 10 && (
              <CompletionStep
                onComplete={handleCompletionNext}
                isLoading={isSubmitting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
