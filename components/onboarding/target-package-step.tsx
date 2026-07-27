'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { fadeInUp } from '@/lib/animations';
import {
  targetPackageSchema,
  type TargetPackageFormData,
  CURRENCY_OPTIONS,
} from '@/lib/validations/onboarding';

interface TargetPackageStepProps {
  defaultValues?: Partial<TargetPackageFormData>;
  onNext: (data: TargetPackageFormData) => void;
  onBack: () => void;
}

export function TargetPackageStep({
  defaultValues,
  onNext,
  onBack,
}: TargetPackageStepProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<TargetPackageFormData>({
    resolver: zodResolver(targetPackageSchema),
    defaultValues: defaultValues || {
      targetPackageMin: 0,
      targetPackageMax: 0,
      currency: 'INR',
    },
    mode: 'onChange',
  });

  const currency = watch('currency');
  const currencySymbol =
    CURRENCY_OPTIONS.find((opt) => opt.value === currency)?.symbol || '₹';

  const onSubmit = (data: TargetPackageFormData) => {
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
        <h2 className="mb-2 text-h3 font-bold text-text-primary">Target Package</h2>
        <p className="text-body-md text-text-secondary">
          What&apos;s your expected salary range? (Annual CTC)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Currency Selector */}
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <Select
              label="Currency"
              options={CURRENCY_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.currency?.message}
              required
            />
          )}
        />

        {/* Package Range */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Minimum Package */}
          <div>
            <label className="mb-2 block text-label-sm font-medium text-text-secondary">
              Minimum Package <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                {currencySymbol}
              </div>
              <Controller
                name="targetPackageMin"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="0"
                    className="h-10 w-full rounded-md border border-surface-border bg-surface-elevated-1 pl-8 pr-4 text-body-md text-text-primary transition-colors duration-fast placeholder:text-text-tertiary hover:border-surface-border-bold focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </div>
            {errors.targetPackageMin && (
              <p className="mt-2 text-body-xs text-error-500">
                {errors.targetPackageMin.message}
              </p>
            )}
            <p className="mt-2 text-body-xs text-text-tertiary">
              Lowest acceptable offer
            </p>
          </div>

          {/* Maximum Package */}
          <div>
            <label className="mb-2 block text-label-sm font-medium text-text-secondary">
              Maximum Package <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                {currencySymbol}
              </div>
              <Controller
                name="targetPackageMax"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    placeholder="0"
                    className="h-10 w-full rounded-md border border-surface-border bg-surface-elevated-1 pl-8 pr-4 text-body-md text-text-primary transition-colors duration-fast placeholder:text-text-tertiary hover:border-surface-border-bold focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </div>
            {errors.targetPackageMax && (
              <p className="mt-2 text-body-xs text-error-500">
                {errors.targetPackageMax.message}
              </p>
            )}
            <p className="mt-2 text-body-xs text-text-tertiary">Your target salary goal</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-primary-500/20 bg-primary-500/5 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary-500/10 p-2">
              <DollarSign className="h-5 w-5 text-primary-400" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-label-md font-semibold text-text-primary">
                Pro Tip
              </h4>
              <p className="text-body-sm text-text-secondary">
                Research typical salary ranges for your target role and companies. Be
                realistic but don&apos;t undersell yourself!
              </p>
            </div>
          </div>
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
