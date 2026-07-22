/**
 * Dependency Verification Module
 * This file verifies that all core dependencies are properly installed and typed
 * Used for development verification only - can be removed after testing
 */

// Core UI
import type { MotionProps } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

// State Management
import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

// Forms & Validation
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import type { ZodSchema } from 'zod';

// Utilities
import type { ClassValue } from 'clsx';
import { format } from 'date-fns';
import { cn } from './cn';

/**
 * Type verification - ensures all imports are correctly typed
 * These types will cause TypeScript errors if dependencies are misconfigured
 */
export type VerifyTypes = {
  // Framer Motion
  motionProps: MotionProps;

  // Lucide React
  iconComponent: LucideIcon;

  // Zustand
  storeCreator: StateCreator<unknown, [], []>;
  storeMutator: StoreMutatorIdentifier;

  // React Hook Form
  formReturn: UseFormReturn<FieldValues>;

  // Zod
  zodSchema: ZodSchema;

  // clsx
  classValue: ClassValue;
};

/**
 * Runtime verification - ensures utilities work correctly
 * These functions should execute without errors
 */
export const verifyRuntime = () => {
  // Verify cn utility (clsx + tailwind-merge)
  const testClassName = cn('px-4', 'px-2', 'py-2', { 'bg-primary-500': true });
  if (typeof testClassName !== 'string') {
    throw new Error('cn utility failed: should return string');
  }

  // Verify date-fns
  const testDate = format(new Date(), 'yyyy-MM-dd');
  if (typeof testDate !== 'string') {
    throw new Error('date-fns failed: format should return string');
  }

  return {
    cn: testClassName,
    date: testDate,
    status: 'All dependencies verified successfully',
  };
};
