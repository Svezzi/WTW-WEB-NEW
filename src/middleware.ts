import { NextResponse, type NextRequest } from 'next/server'

// Completely disable middleware to prevent redirect loops
export function middleware() {
  // Empty function means middleware does nothing
  return;
}

export const config = {
  matcher: [] // Empty matcher means it applies to no routes
} 