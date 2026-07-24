'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OAuthButtons } from './oauth-buttons';
import { signIn } from '@/lib/actions/auth.actions';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/hooks';
import { loginSchema, type LoginFormData } from '@/lib/validations/schemas';

/**
 * Login form component with email/password and OAuth options
 */
export function LoginForm() {
  const router = useRouter();
  const { error: showErrorToast, success: showSuccessToast } = useToast();
  const { setUser, setSession } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);

      const result = await signIn({
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        showErrorToast('Authentication Failed', result.error || 'Invalid email or password');
        return;
      }

      // Update auth store
      if (result.data?.user) {
        setUser(result.data.user);
      }
      if (result.data?.session) {
        setSession(result.data.session);
      }

      showSuccessToast('Welcome back!', 'You have successfully signed in.');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
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
            Or continue with email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          prefix={<Lock className="h-4 w-4" />}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-body-sm">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="h-4 w-4 rounded border-surface-border bg-surface-elevated-2 text-primary-500 transition-colors focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2 focus:ring-offset-surface-background"
            />
            <span className="text-text-secondary">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-body-sm text-primary-400 transition-colors hover:text-primary-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign in
        </Button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-body-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-primary-400 transition-colors hover:text-primary-300"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
