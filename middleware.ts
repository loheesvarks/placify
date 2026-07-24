import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Next.js Middleware for authentication and route protection
 * Runs on every request to protected routes
 */
export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  
  const { pathname } = request.nextUrl;

  // Define protected and public routes
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
  const protectedRoutes = [
    '/dashboard',
    '/roadmap',
    '/mentor',
    '/interview',
    '/resume',
    '/planner',
    '/analytics',
    '/companies',
    '/projects',
    '/settings',
    '/onboarding',
  ];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // TODO: Add onboarding check when profile table is available
  // Check if user has completed onboarding
  // if (user && !user.onboarding_completed && pathname !== '/onboarding') {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/onboarding';
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
