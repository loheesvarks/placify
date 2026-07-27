'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Clock, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import {
  learningPreferencesSchema,
  type LearningPreferencesFormData,
  LEARNING_GOALS,
} from '@/lib/validations/onboarding';

interface LearningPreferencesStepProps {
  defaultValues?: Partial<LearningPreferencesFormData>;
  onNext: (data: LearningPreferencesFormData) => void;
  onBack: () => void;
}

export function LearningPreferencesStep({
  defaultValues,
  onNext,
  onBack,
}: LearningPreferencesStepProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<LearningPreferencesFormData>({
    resolver: zodResolver(learningPreferencesSchema),
    defaultValues: defaultValues || {
      weeklyStudyHours: 20,
      learningGoals: [],
    },
    mode: 'onChange',
  });

  const weeklyHours = watch('weeklyStudyHours');
  const selectedGoals = watch('learningGoals');

  const hoursPerDay = (weeklyHours / 7).toFixed(1);

  const onSubmit = (data: LearningPreferencesFormData) => {
    onNext(data);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-h3 font-bold text-text-primary">
          Learning Preferences
        </h2>
        <p className="text-body-md text-text-secondary">
          Tell us about your availability and learning goals
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Weekly Study Hours */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <label className="text-label-sm font-medium text-text-secondary">
              Weekly Study Hours <span className="text-error-500">*</span>
            </label>
            <div className="flex items-center gap-2 text-h5 font-bold text-primary-400">
              <Clock className="h-5 w-5" />
              {weeklyHours} hrs/week
            </div>
          </div>

          <Controller
            name="weeklyStudyHours"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="70"
                  step="1"
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-800 accent-primary-500"
                  style={{
                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${(field.value / 70) * 100}%, rgb(31 41 55) ${(field.value / 70) * 100}%, rgb(31 41 55) 100%)`,
                  }}
                />
                <div className="flex justify-between text-body-xs text-text-tertiary">
                  <span>1 hr</span>
                  <span>35 hrs</span>
                  <span>70 hrs</span>
                </div>
              </div>
            )}
          />

          <div className="mt-4 rounded-lg border border-glass-border bg-glass-background p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-500/10 p-2">
                <Target className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-body-sm text-text-primary">
                  That&apos;s approximately{' '}
                  <span className="font-semibold text-primary-400">{hoursPerDay}</span>{' '}
                  hours per day
                </p>
                <p className="text-body-xs text-text-tertiary">
                  {weeklyHours < 10 && 'Light commitment - slower but steady progress'}
                  {weeklyHours >= 10 && weeklyHours < 20 && 'Moderate pace - balanced approach'}
                  {weeklyHours >= 20 && weeklyHours < 35 && 'Intensive learning - great for faster results'}
                  {weeklyHours >= 35 && 'Full-time commitment - rapid skill development'}
                </p>
              </div>
            </div>
          </div>

          {errors.weeklyStudyHours && (
            <p className="mt-2 text-body-sm text-error-500">
              {errors.weeklyStudyHours.message}
            </p>
          )}
        </div>

        {/* Learning Goals */}
        <div>
          <label className="mb-4 block text-label-sm font-medium text-text-secondary">
            Learning Goals <span className="text-error-500">*</span>
          </label>
          <p className="mb-4 text-body-sm text-text-tertiary">
            Select what you want to achieve (1-10)
          </p>

          <Controller
            name="learningGoals"
            control={control}
            render={({ field }) => (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-3 sm:grid-cols-2"
              >
                {LEARNING_GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <motion.button
                      key={goal}
                      type="button"
                      variants={staggerItem}
                      onClick={() => {
                        if (isSelected) {
                          field.onChange(selectedGoals.filter((g) => g !== goal));
                        } else if (selectedGoals.length < 10) {
                          field.onChange([...selectedGoals, goal]);
                        }
                      }}
                      disabled={!isSelected && selectedGoals.length >= 10}
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all duration-fast disabled:cursor-not-allowed disabled:opacity-40 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10 shadow-glow-sm'
                          : 'border-surface-border bg-surface-elevated-1 hover:border-primary-500/30 hover:bg-glass-background'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-surface-border bg-surface-elevated-1'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <span
                        className={`flex-1 text-body-sm font-medium ${
                          isSelected ? 'text-primary-400' : 'text-text-secondary'
                        }`}
                      >
                        {goal}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          />

          {errors.learningGoals && (
            <p className="mt-4 text-body-sm text-error-500">
              {errors.learningGoals.message}
            </p>
          )}

          {selectedGoals.length > 0 && (
            <p className="mt-4 text-body-sm text-text-tertiary">
              {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button type="submit" disabled={!isValid} className="flex-1">
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
