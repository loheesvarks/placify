'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { signInWithOAuth } from '@/lib/actions/auth.actions';
import { useToast } from '@/lib/hooks';

/**
 * OAuth sign-in buttons for Google and GitHub
 */
export function OAuthButtons() {
  const [isLoading, setIsLoading] = React.useState<'google' | 'github' | null>(null);
  const { error: showErrorToast } = useToast();

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(provider);
      const result = await signInWithOAuth(provider);
      
      if (!result.success && result.error) {
        showErrorToast('Authentication Error', result.error);
      }
    } catch {
      showErrorToast('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="secondary"
        onClick={() => handleOAuthSignIn('google')}
        loading={isLoading === 'google'}
        disabled={isLoading !== null}
        leftIcon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
        }
        aria-label="Sign in with Google"
      >
        Google
      </Button>

      <Button
        type="button"
        variant="secondary"
        onClick={() => handleOAuthSignIn('github')}
        loading={isLoading === 'github'}
        disabled={isLoading !== null}
        leftIcon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
            <path d="M9 0C4.0275 0 0 4.13211 0 9.22838C0 13.3065 2.5785 16.7648 6.15375 17.9841C6.60375 18.0709 6.76875 17.7853 6.76875 17.5403C6.76875 17.3212 6.76125 16.7405 6.7575 15.9712C4.254 16.5277 3.726 14.7332 3.726 14.7332C3.3165 13.6681 2.72475 13.3832 2.72475 13.3832C1.9095 12.8111 2.78775 12.8229 2.78775 12.8229C3.6915 12.887 4.16625 13.7737 4.16625 13.7737C4.96875 15.1847 6.273 14.777 6.7875 14.5414C6.8685 13.9443 7.10025 13.5381 7.3575 13.3073C5.35875 13.0764 3.258 12.2829 3.258 8.74679C3.258 7.73935 3.60675 6.91471 4.18425 6.26958C4.083 6.03694 3.77925 5.09651 4.263 3.82615C4.263 3.82615 5.01675 3.57795 6.738 4.77119C7.458 4.56851 8.223 4.46715 8.988 4.46355C9.753 4.46715 10.518 4.56851 11.238 4.77119C12.948 3.57795 13.7017 3.82615 13.7017 3.82615C14.1855 5.09651 13.8818 6.03694 13.7917 6.26958C14.3655 6.91471 14.7142 7.73935 14.7142 8.74679C14.7142 12.2923 12.6105 13.0725 10.608 13.2995C10.923 13.5765 11.2155 14.1423 11.2155 15.0071C11.2155 16.242 11.205 17.2344 11.205 17.5403C11.205 17.7878 11.3625 18.0755 11.8208 17.9833C15.4162 16.7609 18 13.3041 18 9.22838C18 4.13211 13.9703 0 9 0Z" />
          </svg>
        }
        aria-label="Sign in with GitHub"
      >
        GitHub
      </Button>
    </div>
  );
}
