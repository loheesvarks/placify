'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OAuthButtons } from './oauth-buttons';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { signUp } from '@/lib/actions/auth.actions';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/hooks';
import { registerSchema, type RegisterFormData } from '@/lib/validations/schemas';

/**
 * Registration form component with email/password and OAuth options
 */
export function RegisterForm() {
  const router = useRouter();
  const { error: showErrorToast, success: showSuccessToast } = useToast();
  const { setUser, setSession } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);

      const result = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      if (!result.success) {
        showErrorToast('Registration Failed', result.error || 'Unable to create account');
        return;
      }

      // Update auth store
      if (result.data?.user) {
        setUser(result.data.user);
      }
      if (result.data?.session) {
        setSession(result.data.session);
      }

      showSuccessToast('Account Created!', 'Please check your email to verify your account.');

      // Redirect to verify email page or onboarding
      router.push('/verify-email');
    } catch (error) {
      console.error('Registration error:', error);
      showErrorToast('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* OAuth Buttons */}
      <OAuthButtons />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-border" />
        </div>
        <div className="relative flex justify-center text-body-xs uppercase">
          <span className="bg-surface-elevated-1 px-2 text-text-tertiary">
            Or sign up with email
          </span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('fullName')}
          type="text"
          label="Full name"
          placeholder="John Doe"
          error={errors.fullName?.message}
          prefix={<User className="h-4 w-4" />}
          autoComplete="name"
          required
        />

        <Input
          {...register('email')}
          type="email"
          label="Email address"
          placeholder="you@example.com"
          error={errors.email?.message}
          prefix={<Mail className="h-4 w-4" />}
          autoComplete="email"
          required
        />

        <div className="space-y-2">
          <Input
            {...register('password')}
            type="password"
            label="Password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            prefix={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            required
          />
          <PasswordStrengthIndicator password={password} showRequirements />
        </div>

        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          prefix={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          required
        />

        <div className="space-y-4">
          <label className="flex items-start gap-2 text-body-sm">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-surface-border bg-surface-elevated-2 text-primary-500 transition-colors focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 focus:ring-offset-surface-background"
              aria-describedby="terms-error"
            />
            <span className="text-text-secondary">
              I agree to the{' '}
              <Link
                href="/terms"
                className="text-primary-400 transition-colors hover:text-primary-300"
                target="_blank"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-primary-400 transition-colors hover:text-primary-300"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-body-xs text-error-500" id="terms-error" role="alert">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create account
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-body-sm text-text-secondary">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-primary-400 transition-colors hover:text-primary-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
