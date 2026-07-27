'use client';

import { motion } from 'framer-motion';
import { Edit2, User, GraduationCap, Briefcase, DollarSign, Code, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import type { OnboardingData } from '@/lib/types/onboarding';
import { CURRENCY_OPTIONS } from '@/lib/validations/onboarding';

interface ReviewStepProps {
  data: Partial<OnboardingData>;
  onNext: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export function ReviewStep({ data, onNext, onBack, onEdit }: ReviewStepProps) {
  const currencySymbol =
    CURRENCY_OPTIONS.find((opt) => opt.value === data.currency)?.symbol || '₹';

  const sections = [
    {
      title: 'Personal Information',
      icon: User,
      step: 2,
      items: [
        { label: 'Name', value: data.fullName },
        { label: 'College', value: data.college },
        { label: 'Degree', value: data.degree },
        { label: 'Department', value: data.department },
      ],
    },
    {
      title: 'Education',
      icon: GraduationCap,
      step: 3,
      items: [
        { label: 'Current Year', value: data.currentYear },
        { label: 'Graduation Year', value: data.graduationYear },
      ],
    },
    {
      title: 'Career Goal',
      icon: Briefcase,
      step: 4,
      items: [{ label: 'Preferred Role', value: data.preferredRole }],
    },
    {
      title: 'Target Package',
      icon: DollarSign,
      step: 5,
      items: [
        {
          label: 'Salary Range',
          value: `${currencySymbol}${data.targetPackageMin?.toLocaleString()} - ${currencySymbol}${data.targetPackageMax?.toLocaleString()}`,
        },
      ],
    },
    {
      title: 'Technology Interests',
      icon: Code,
      step: 6,
      items: [
        {
          label: 'Technologies',
          value: data.preferredTechStack?.length || 0,
          component: (
            <div className="flex flex-wrap gap-2">
              {data.preferredTechStack?.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'Current Skills',
      icon: Award,
      step: 7,
      items: [
        {
          label: 'Skills',
          value: data.currentSkills?.length || 0,
          component: (
            <div className="space-y-2">
              {data.currentSkills?.slice(0, 5).map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between rounded-md bg-surface-elevated-1 px-3 py-2"
                >
                  <span className="text-body-sm text-text-primary">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-800">
                      <div
                        className="h-full bg-gradient-primary"
                        style={{ width: `${skill.proficiency * 10}%` }}
                      />
                    </div>
                    <span className="text-body-xs text-text-tertiary">
                      {skill.proficiency}/10
                    </span>
                  </div>
                </div>
              ))}
              {(data.currentSkills?.length || 0) > 5 && (
                <p className="text-body-xs text-text-tertiary">
                  +{(data.currentSkills?.length || 0) - 5} more skills
                </p>
              )}
            </div>
          ),
        },
      ],
    },
    {
      title: 'Learning Preferences',
      icon: Clock,
      step: 8,
      items: [
        { label: 'Weekly Study Hours', value: `${data.weeklyStudyHours} hours` },
        {
          label: 'Learning Goals',
          value: data.learningGoals?.length || 0,
          component: (
            <ul className="list-inside list-disc space-y-1">
              {data.learningGoals?.map((goal) => (
                <li key={goal} className="text-body-sm text-text-secondary">
                  {goal}
                </li>
              ))}
            </ul>
          ),
        },
      ],
    },
  ];

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-h3 font-bold text-text-primary">Review Your Information</h2>
        <p className="text-body-md text-text-secondary">
          Please review your details before completing onboarding
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-8 space-y-4"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              variants={staggerItem}
              className="rounded-lg border border-glass-border bg-glass-background p-6 backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-500/10 p-2">
                    <Icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <h3 className="text-h6 font-semibold text-text-primary">
                    {section.title}
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(section.step)}
                  leftIcon={<Edit2 className="h-4 w-4" />}
                >
                  Edit
                </Button>
              </div>

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label}>
                    <p className="mb-1 text-label-sm text-text-tertiary">{item.label}</p>
                    {'component' in item && item.component ? (
                      item.component
                    ) : (
                      <p className="text-body-md text-text-primary">
                        {item.value || 'Not provided'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Card */}
      <div className="mb-8 rounded-lg border border-primary-500/20 bg-primary-500/5 p-4">
        <p className="text-body-sm text-text-secondary">
          By completing onboarding, you agree to our Terms of Service and Privacy Policy.
          We&apos;ll use this information to create your personalized learning roadmap.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Complete Onboarding
        </Button>
      </div>
    </motion.div>
  );
}
