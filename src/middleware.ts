import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simply allow all requests through without any auth checks
  // This is for demonstration purposes only
  return NextResponse.next();
}

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