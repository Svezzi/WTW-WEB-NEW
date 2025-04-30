import { NextResponse, type NextRequest } from 'next/server'

// Skip authentication completely - we'll handle auth in components if needed
export function middleware(request: NextRequest) {
  // Always continue without any auth checks
  return NextResponse.next();
}

// Apply middleware only to the specific protected routes if needed
export const config = {
  matcher: [
    '/settings',
    '/settings/:path*',
    '/my-routes',
    '/my-routes/:path*',
    '/create-route',
    '/create-route/:path*'
  ]
} 