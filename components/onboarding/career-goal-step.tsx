'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import {
  careerGoalSchema,
  type CareerGoalFormData,
  COMMON_ROLES,
} from '@/lib/validations/onboarding';

interface CareerGoalStepProps {
  defaultValues?: Partial<CareerGoalFormData>;
  onNext: (data: CareerGoalFormData) => void;
  onBack: () => void;
}

export function CareerGoalStep({ defaultValues, onNext, onBack }: CareerGoalStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CareerGoalFormData>({
    resolver: zodResolver(careerGoalSchema),
    defaultValues: defaultValues || {
      preferredRole: '',
    },
    mode: 'onChange',
  });

  const selectedRole = watch('preferredRole');

  const filteredRoles = searchQuery
    ? COMMON_ROLES.filter((role) =>
        role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COMMON_ROLES;

  const onSubmit = (data: CareerGoalFormData) => {
    onNext(data);
  };

  const handleRoleSelect = (role: string) => {
    setValue('preferredRole', role, { shouldValidate: true });
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-h3 font-bold text-text-primary">Career Goal</h2>
        <p className="text-body-md text-text-secondary">
          What role are you targeting for placement?
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Search/Custom Input */}
        <div className="relative">
          <Input
            placeholder="Search for a role or enter custom..."
            value={searchQuery || selectedRole}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              setValue('preferredRole', value, { shouldValidate: true });
            }}
            prefix={<Search className="h-4 w-4" />}
            error={errors.preferredRole?.message}
          />
        </div>

        {/* Common Roles Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredRoles.map((role) => (
            <motion.button
              key={role}
              type="button"
              variants={staggerItem}
              onClick={() => handleRoleSelect(role)}
              className={`rounded-lg border-2 p-4 text-left text-body-sm font-medium transition-all duration-fast ${
                selectedRole === role
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400 shadow-glow-sm'
                  : 'border-surface-border bg-surface-elevated-1 text-text-secondary hover:border-primary-500/30 hover:bg-glass-background'
              }`}
            >
              {role}
            </motion.button>
          ))}
        </motion.div>

        {filteredRoles.length === 0 && searchQuery && (
          <div className="rounded-lg border border-surface-border bg-surface-elevated-1 p-6 text-center">
            <p className="text-body-sm text-text-secondary">
              No matching roles found. Press Continue to use &quot;{searchQuery}&quot; as your custom
              role.
            </p>
          </div>
        )}

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
