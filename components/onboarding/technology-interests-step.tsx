'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import {
  technologyInterestsSchema,
  type TechnologyInterestsFormData,
  COMMON_TECHNOLOGIES,
} from '@/lib/validations/onboarding';

interface TechnologyInterestsStepProps {
  defaultValues?: Partial<TechnologyInterestsFormData>;
  onNext: (data: TechnologyInterestsFormData) => void;
  onBack: () => void;
}

export function TechnologyInterestsStep({
  defaultValues,
  onNext,
  onBack,
}: TechnologyInterestsStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<TechnologyInterestsFormData>({
    resolver: zodResolver(technologyInterestsSchema),
    defaultValues: defaultValues || {
      preferredTechStack: [],
    },
    mode: 'onChange',
  });

  const selectedTech = watch('preferredTechStack');

  const filteredTech = searchQuery
    ? COMMON_TECHNOLOGIES.filter((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COMMON_TECHNOLOGIES;

  const onSubmit = (data: TechnologyInterestsFormData) => {
    onNext(data);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-h3 font-bold text-text-primary">Technology Interests</h2>
        <p className="text-body-md text-text-secondary">
          Select technologies you want to work with (1-15)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Selected Technologies */}
        {selectedTech.length > 0 && (
          <div className="rounded-lg border border-glass-border bg-glass-background p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-label-sm font-medium text-text-secondary">
                Selected ({selectedTech.length}/15)
              </h3>
              <Controller
                name="preferredTechStack"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange([])}
                    className="text-body-xs text-text-tertiary transition-colors hover:text-error-400"
                  >
                    Clear all
                  </button>
                )}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Controller
                name="preferredTechStack"
                control={control}
                render={({ field }) => (
                  <>
                    {selectedTech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="primary"
                        className="flex items-center gap-1 px-3 py-1.5"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(selectedTech.filter((t) => t !== tech))
                          }
                          className="ml-1 rounded hover:bg-primary-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Technology Grid */}
        <Controller
          name="preferredTechStack"
          control={control}
          render={({ field }) => (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {filteredTech.map((tech) => {
                const isSelected = selectedTech.includes(tech);
                return (
                  <motion.button
                    key={tech}
                    type="button"
                    variants={staggerItem}
                    onClick={() => {
                      if (isSelected) {
                        field.onChange(selectedTech.filter((t) => t !== tech));
                      } else if (selectedTech.length < 15) {
                        field.onChange([...selectedTech, tech]);
                      }
                    }}
                    disabled={!isSelected && selectedTech.length >= 15}
                    className={`rounded-lg border-2 p-3 text-left text-body-sm font-medium transition-all duration-fast disabled:cursor-not-allowed disabled:opacity-40 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400 shadow-glow-sm'
                        : 'border-surface-border bg-surface-elevated-1 text-text-secondary hover:border-primary-500/30 hover:bg-glass-background'
                    }`}
                  >
                    {tech}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        />

        {errors.preferredTechStack && (
          <p className="text-body-sm text-error-500">
            {errors.preferredTechStack.message}
          </p>
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
