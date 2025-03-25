import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For now, we'll only protect the dashboard route
  // Later we can add more sophisticated auth checks
  const isAuthPage = request.nextUrl.pathname === '/login'
  const isAdminPage = request.nextUrl.pathname.startsWith('/(admin)')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/sb-management')
  
  // Check for auth token in cookies
  const authToken = request.cookies.get('sb-access-token')?.value
  console.log('authToken :', authToken);

  // If we have an auth token and trying to access login, redirect to admin dashboard
  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/(admin)/dashboard', request.url))
  }

  // If trying to access protected pages without auth token, redirect to login
  if ((isAdminPage || isDashboardPage) && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/dashboard/:path*',
    '/login',
    '/(admin)/:path*',
    '/sb-management/:path*',
  ],
} 