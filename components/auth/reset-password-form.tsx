'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { updatePassword } from '@/lib/actions/auth.actions';
import { useToast } from '@/lib/hooks';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/schemas';

/**
 * Reset password form component
 * Allows user to set a new password after clicking reset link
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const { error: showErrorToast, success: showSuccessToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);

      const result = await updatePassword(data.password);

      if (!result.success) {
        showErrorToast('Error', result.error || 'Unable to reset password');
        return;
      }

      setResetSuccess(true);
      showSuccessToast('Password Updated', 'Your password has been successfully reset.');

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      showErrorToast('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-500/10">
          <CheckCircle className="h-8 w-8 text-success-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-h4 font-semibold text-text-primary">
            Password reset successful!
          </h2>
          <p className="text-body-md text-text-secondary">
            You can now sign in with your new password.
          </p>
        </div>

        <p className="text-body-sm text-text-tertiary">
          Redirecting to sign in...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-body-md text-text-secondary">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            {...register('password')}
            type="password"
            label="New password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            prefix={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            autoFocus
            required
          />
          <PasswordStrengthIndicator password={password} showRequirements />
        </div>

        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm new password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          prefix={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Reset password
        </Button>
      </form>
    </div>
  );
}
