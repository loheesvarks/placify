import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding - Placify',
  description: 'Complete your profile to get started with personalized learning',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-surface-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-secondary-500/5 blur-3xl" />
      </div>

      {/* Content */}
      <main className="relative z-0">{children}</main>
    </div>
  );
}
