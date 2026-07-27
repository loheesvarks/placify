'use client';

import { motion } from 'framer-motion';
import { Sparkles, Target, Rocket, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: Target,
      title: 'Personalized Roadmap',
      description: 'Get a custom learning path tailored to your goals and skills',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Guidance',
      description: 'Your personal mentor helping you every step of the way',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your growth with detailed analytics and insights',
    },
    {
      icon: Rocket,
      title: 'Land Your Dream Job',
      description: 'Prepare for top companies with targeted interview prep',
    },
  ];

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center"
    >
      {/* Logo/Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow-md"
      >
        <Sparkles className="h-10 w-10 text-white" />
      </motion.div>

      {/* Welcome Message */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4 text-display-md font-bold text-text-primary"
      >
        Welcome to Placify
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12 max-w-2xl text-body-lg text-text-secondary"
      >
        Your AI-powered placement preparation platform. We&apos;ll create a personalized roadmap
        to help you achieve your career goals.
      </motion.p>

      {/* Features Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-12 grid w-full max-w-3xl gap-6 sm:grid-cols-2"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={staggerItem}
              className="rounded-lg border border-glass-border bg-glass-background p-6 backdrop-blur-md transition-all duration-normal hover:border-primary-500/30 hover:shadow-glow-sm"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-500/10 p-3">
                <Icon className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="mb-2 text-h6 font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="text-body-sm text-text-secondary">{feature.description}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button size="lg" onClick={onNext} className="px-8">
          Get Started
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-body-sm text-text-tertiary"
      >
        This will take about 3-5 minutes
      </motion.p>
    </motion.div>
  );
}
