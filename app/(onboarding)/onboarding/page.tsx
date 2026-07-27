import { redirect } from 'next/navigation';
import { checkOnboardingStatus } from '@/lib/actions/onboarding.actions';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

export default async function OnboardingPage() {
  // Check if user has already completed onboarding
  const { completed } = await checkOnboardingStatus();

  if (completed) {
    redirect('/dashboard');
  }

  return <OnboardingWizard />;
}
