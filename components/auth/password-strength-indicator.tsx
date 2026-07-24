'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { calculatePasswordStrength, passwordRequirements } from '@/lib/validations/schemas';
import { cn } from '@/lib/utils/cn';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

/**
 * Visual indicator for password strength
 * Shows strength meter and optional requirements checklist
 */
export function PasswordStrengthIndicator({
  password,
  showRequirements = false,
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);
  const percentage = (strength.score / 4) * 100;

  if (!password && !showRequirements) return null;

  return (
    <div className="space-y-3">
      {/* Strength Meter */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-body-xs">
            <span className="text-text-tertiary">Password strength</span>
            <span className={cn('font-medium', strength.color)}>
              {strength.label}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                strength.score === 0 && 'bg-error-500',
                strength.score === 1 && 'bg-error-500',
                strength.score === 2 && 'bg-warning-500',
                strength.score === 3 && 'bg-success-400',
                strength.score === 4 && 'bg-success-500'
              )}
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={strength.score}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label={`Password strength: ${strength.label}`}
            />
          </div>
        </div>
      )}

      {/* Requirements Checklist */}
      {showRequirements && (
        <ul className="space-y-1.5" role="list" aria-label="Password requirements">
          {passwordRequirements.map((req, index) => {
            const isMet = password ? req.test(password) : false;
            return (
              <li
                key={index}
                className={cn(
                  'flex items-center gap-2 text-body-xs transition-colors',
                  isMet ? 'text-success-500' : 'text-text-tertiary'
                )}
              >
                {isMet ? (
                  <Check className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <X className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                )}
                <span>{req.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
