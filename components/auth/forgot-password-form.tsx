'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/lib/actions/auth.actions';
import { useToast } from '@/lib/hooks';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/schemas';

/**
 * Forgot password form component
 * Sends password reset email to the user
 */
export function ForgotPasswordForm() {
  const { error: showErrorToast, success: showSuccessToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);

      const result = await resetPassword(data.email);

      if (!result.success) {
        showErrorToast('Error', result.error || 'Unable to send reset email');
        return;
      }

      setEmailSent(true);
      showSuccessToast('Email Sent', 'Check your inbox for password reset instructions.');
    } catch (error) {
      console.error('Forgot password error:', error);
      showErrorToast('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-500/10">
          <Mail className="h-8 w-8 text-success-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-h4 font-semibold text-text-primary">
            Check your email
          </h2>
          <p className="text-body-md text-text-secondary">
            We&apos;ve sent password reset instructions to{' '}
            <span className="font-medium text-text-primary">
              {getValues('email')}
            </span>
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <p className="text-body-sm text-text-tertiary">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => setEmailSent(false)}
          >
            Try another email
          </Button>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-body-sm text-primary-400 transition-colors hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-body-md text-text-secondary">
          Enter your email address and we&apos;ll send you instructions to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="Email address"
          placeholder="you@example.com"
          error={errors.email?.message}
          prefix={<Mail className="h-4 w-4" />}
          autoComplete="email"
          autoFocus
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
          Send reset instructions
        </Button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-body-sm text-primary-400 transition-colors hover:text-primary-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}
