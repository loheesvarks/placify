'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { fadeInUp, slideInLeft } from '@/lib/animations';
import {
  currentSkillsSchema,
  type CurrentSkillsFormData,
} from '@/lib/validations/onboarding';

interface CurrentSkillsStepProps {
  defaultValues?: Partial<CurrentSkillsFormData>;
  onNext: (data: CurrentSkillsFormData) => void;
  onBack: () => void;
}

const PROFICIENCY_LEVELS = [
  { value: '1', label: '1 - Beginner' },
  { value: '2', label: '2 - Beginner+' },
  { value: '3', label: '3 - Novice' },
  { value: '4', label: '4 - Novice+' },
  { value: '5', label: '5 - Intermediate' },
  { value: '6', label: '6 - Intermediate+' },
  { value: '7', label: '7 - Advanced' },
  { value: '8', label: '8 - Advanced+' },
  { value: '9', label: '9 - Expert' },
  { value: '10', label: '10 - Master' },
];

const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skill' },
  { value: 'domain', label: 'Domain Knowledge' },
];

export function CurrentSkillsStep({
  defaultValues,
  onNext,
  onBack,
}: CurrentSkillsStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = useForm<CurrentSkillsFormData>({
    resolver: zodResolver(currentSkillsSchema),
    defaultValues: defaultValues || {
      currentSkills: [
        { name: '', proficiency: 5, category: 'technical' },
        { name: '', proficiency: 5, category: 'technical' },
        { name: '', proficiency: 5, category: 'technical' },
      ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'currentSkills',
  });

  const onSubmit = (data: CurrentSkillsFormData) => {
    onNext(data);
  };

  const addSkill = () => {
    if (fields.length < 20) {
      append({ name: '', proficiency: 5, category: 'technical' });
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-h3 font-bold text-text-primary">Current Skills</h2>
        <p className="text-body-md text-text-secondary">
          List your current skills and rate your proficiency (3-20 skills)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Skills List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                variants={slideInLeft}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                className="rounded-lg border border-glass-border bg-glass-background p-4 backdrop-blur-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Skill Name */}
                    <Input
                      placeholder="e.g., React, Python, Problem Solving"
                      {...register(`currentSkills.${index}.name`)}
                      error={errors.currentSkills?.[index]?.name?.message}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Proficiency */}
                      <Controller
                        name={`currentSkills.${index}.proficiency`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            label="Proficiency"
                            options={PROFICIENCY_LEVELS}
                            value={field.value.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            error={
                              errors.currentSkills?.[index]?.proficiency?.message
                            }
                          />
                        )}
                      />

                      {/* Category */}
                      <Controller
                        name={`currentSkills.${index}.category`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            label="Category"
                            options={SKILL_CATEGORIES}
                            value={field.value}
                            onValueChange={field.onChange}
                            error={errors.currentSkills?.[index]?.category?.message}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  {fields.length > 3 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-2 rounded-lg p-2 text-text-tertiary transition-colors hover:bg-error-500/10 hover:text-error-400"
                      aria-label="Remove skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Skill Button */}
        {fields.length < 20 && (
          <Button
            type="button"
            variant="secondary"
            onClick={addSkill}
            leftIcon={<Plus className="h-4 w-4" />}
            className="w-full"
          >
            Add Another Skill ({fields.length}/20)
          </Button>
        )}

        {/* Error Message */}
        {errors.currentSkills?.message && (
          <div className="flex items-start gap-2 rounded-lg border border-error-500/20 bg-error-500/5 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-error-500" />
            <p className="text-body-sm text-error-500">{errors.currentSkills.message}</p>
          </div>
        )}

        {/* Proficiency Guide */}
        <div className="rounded-lg border border-glass-border bg-glass-background p-4 backdrop-blur-md">
          <h4 className="mb-3 text-label-md font-semibold text-text-primary">
            Proficiency Guide
          </h4>
          <div className="grid gap-2 text-body-xs text-text-secondary sm:grid-cols-2">
            <div>
              <span className="font-medium text-text-primary">1-2:</span> Just started
              learning
            </div>
            <div>
              <span className="font-medium text-text-primary">3-4:</span> Can work with
              guidance
            </div>
            <div>
              <span className="font-medium text-text-primary">5-6:</span> Comfortable
              working independently
            </div>
            <div>
              <span className="font-medium text-text-primary">7-8:</span> Can mentor
              others
            </div>
            <div>
              <span className="font-medium text-text-primary">9-10:</span> Expert level,
              deep knowledge
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
