'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeInUp } from '@/lib/animations';
import {
  educationSchema,
  type EducationFormData,
} from '@/lib/validations/onboarding';

interface EducationStepProps {
  defaultValues?: Partial<EducationFormData>;
  onNext: (data: EducationFormData) => void;
  onBack: () => void;
}

export function EducationStep({ defaultValues, onNext, onBack }: EducationStepProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [1, 2, 3, 4, 5];
  const graduationYearOptions = Array.from({ length: 7 }, (_, i) => currentYear + i);

  const {
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: defaultValues || {
      currentYear: 3,
      graduationYear: currentYear + 1,
    },
    mode: 'onChange',
  });

  const selectedCurrentYear = watch('currentYear');
  const selectedGraduationYear = watch('graduationYear');

  const onSubmit = (data: EducationFormData) => {
    onNext(data);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-h3 font-bold text-text-primary">Education Details</h2>
        <p className="text-body-md text-text-secondary">
          Help us understand your academic timeline
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Current Year */}
        <div>
          <label className="mb-3 block text-label-sm font-medium text-text-secondary">
            Current Year <span className="text-error-500">*</span>
          </label>
          <div className="grid grid-cols-5 gap-3">
            {yearOptions.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setValue('currentYear', year, { shouldValidate: true })}
                className={`rounded-lg border-2 p-4 text-h5 font-semibold transition-all duration-fast ${
                  selectedCurrentYear === year
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400 shadow-glow-sm'
                    : 'border-surface-border bg-surface-elevated-1 text-text-secondary hover:border-primary-500/30 hover:bg-glass-background'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <p className="mt-2 text-body-xs text-text-tertiary">
            Select your current academic year
          </p>
        </div>

        {/* Graduation Year */}
        <div>
          <label className="mb-3 block text-label-sm font-medium text-text-secondary">
            Expected Graduation Year <span className="text-error-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {graduationYearOptions.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() =>
                  setValue('graduationYear', year, { shouldValidate: true })
                }
                className={`rounded-lg border-2 p-3 text-body-md font-semibold transition-all duration-fast ${
                  selectedGraduationYear === year
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400 shadow-glow-sm'
                    : 'border-surface-border bg-surface-elevated-1 text-text-secondary hover:border-primary-500/30 hover:bg-glass-background'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <p className="mt-2 text-body-xs text-text-tertiary">
            When do you expect to graduate?
          </p>
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
