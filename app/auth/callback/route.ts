import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback route for handling OAuth and email verification
 * This route handles the redirect from Supabase after OAuth or email verification
 * URL: /auth/callback (without route group parentheses)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  const error = requestUrl.searchParams.get('error');
  const errorCode = requestUrl.searchParams.get('error_code');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const type = requestUrl.searchParams.get('type');

  console.log('Auth callback received:', { code: !!code, error, errorCode, type });

  // Handle OAuth/reset password errors
  if (error || errorCode) {
    console.error('Auth callback error:', { error, errorCode, errorDescription });
    
    // If it's a password reset with expired link, redirect to forgot password
    if (errorCode === 'otp_expired' || error === 'access_denied') {
      return NextResponse.redirect(
        new URL(
          `/forgot-password?error=${encodeURIComponent('The reset link has expired. Please request a new one.')}`,
          requestUrl.origin
        )
      );
    }
    
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorDescription || error || 'Authentication failed')}`,
        requestUrl.origin
      )
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      );
    }
    
    console.log('Session exchanged successfully, type:', type);
    
    // If type is recovery (password reset), redirect to reset password page
    if (type === 'recovery') {
      console.log('Redirecting to reset password page');
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
    }
  }

  // Redirect to the next URL or dashboard
  console.log('Redirecting to:', next);
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

export const dynamic = 'force-dynamic';
