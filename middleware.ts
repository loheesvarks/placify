import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { ROUTES } from '@/lib/constants';

/**
 * Next.js Middleware for authentication and route protection
 * Runs on every request to protected routes
 */
export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  
  const { pathname } = request.nextUrl;

  // Define protected and public routes
  const authRoutes = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD, ROUTES.VERIFY_EMAIL];
  const protectedRoutes = [
    ROUTES.DASHBOARD,
    '/roadmap',
    '/mentor',
    '/interview',
    '/resume',
    '/planner',
    '/analytics',
    '/companies',
    '/projects',
    '/settings',
    ROUTES.ONBOARDING,
  ];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  // Allow /reset-password for both authenticated and unauthenticated users
  // (authenticated users need it during password recovery flow)
  const isResetPasswordPage = pathname.startsWith(ROUTES.RESET_PASSWORD);

  // Redirect authenticated users away from auth pages (except reset password)
  if (user && isAuthRoute && !isResetPasswordPage) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.DASHBOARD;
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // TODO: Add onboarding check when profile table is available
  // Check if user has completed onboarding
  // if (user && !user.onboarding_completed && pathname !== ROUTES.ONBOARDING) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = ROUTES.ONBOARDING;
  //   return NextResponse.redirect(url);
  // }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
