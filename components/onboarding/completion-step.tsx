'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeInUp, scaleIn } from '@/lib/animations';

interface CompletionStepProps {
  onComplete: () => void;
  isLoading?: boolean;
}

export function CompletionStep({ onComplete, isLoading }: CompletionStepProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center"
    >
      {/* Success Icon */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary shadow-glow-lg"
      >
        <CheckCircle2 className="h-12 w-12 text-white" />
      </motion.div>

      {/* Success Message */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4 text-display-md font-bold text-text-primary"
      >
        You&apos;re All Set!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8 max-w-2xl text-body-lg text-text-secondary"
      >
        Your profile is complete. We&apos;re generating your personalized learning roadmap
        tailored to your goals and skills.
      </motion.p>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12 w-full max-w-2xl space-y-4"
      >
        {[
          {
            icon: Sparkles,
            title: 'AI-Powered Roadmap',
            description: 'Custom learning path based on your profile',
          },
          {
            icon: CheckCircle2,
            title: 'Track Your Progress',
            description: 'Monitor milestones and celebrate achievements',
          },
          {
            icon: ArrowRight,
            title: 'Get Started Today',
            description: 'Begin your journey to landing your dream job',
          },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-4 rounded-lg border border-glass-border bg-glass-background p-4 backdrop-blur-md"
            >
              <div className="rounded-lg bg-primary-500/10 p-3">
                <Icon className="h-6 w-6 text-primary-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="mb-1 text-body-md font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-text-secondary">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          size="lg"
          onClick={onComplete}
          loading={isLoading}
          rightIcon={!isLoading && <ArrowRight className="h-5 w-5" />}
          className="px-8"
        >
          {isLoading ? 'Setting up your dashboard...' : 'Go to Dashboard'}
        </Button>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-body-sm text-text-tertiary"
      >
        Welcome to the Placify family! 🎉
      </motion.div>
    </motion.div>
  );
}
