'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { fadeInUp } from '@/lib/animations';
import {
  personalInfoSchema,
  type PersonalInfoFormData,
  DEGREE_OPTIONS,
} from '@/lib/validations/onboarding';

interface PersonalInfoStepProps {
  defaultValues?: Partial<PersonalInfoFormData>;
  onNext: (data: PersonalInfoFormData) => void;
  onBack: () => void;
}

export function PersonalInfoStep({ defaultValues, onNext, onBack }: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: defaultValues || {
      fullName: '',
      college: '',
      degree: '',
      department: '',
    },
    mode: 'onChange',
  });

  const degree = watch('degree');

  const onSubmit = (data: PersonalInfoFormData) => {
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
        <h2 className="mb-2 text-h3 font-bold text-text-primary">Personal Information</h2>
        <p className="text-body-md text-text-secondary">
          Tell us a bit about yourself to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          required
          {...register('fullName')}
        />

        {/* College */}
        <Input
          label="College/University"
          placeholder="Enter your college or university name"
          error={errors.college?.message}
          required
          {...register('college')}
        />

        {/* Degree */}
        <Select
          label="Degree"
          options={DEGREE_OPTIONS}
          value={degree}
          onValueChange={(value) => setValue('degree', value, { shouldValidate: true })}
          placeholder="Select your degree"
          error={errors.degree?.message}
          required
        />

        {/* Department */}
        <Input
          label="Department/Major"
          placeholder="e.g., Computer Science, Information Technology"
          error={errors.department?.message}
          helperText="Your field of study or major"
          required
          {...register('department')}
        />

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
