import { redirect } from 'next/navigation';
import { checkOnboardingStatus } from '@/lib/actions/onboarding.actions';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

// Force dynamic rendering - this page requires authentication check
export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  // Check if user has already completed onboarding
  const { completed } = await checkOnboardingStatus();

  if (completed) {
    redirect('/dashboard');
  }

  return <OnboardingWizard />;
}
