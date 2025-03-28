import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Only check auth for protected routes
  if (!request.nextUrl.pathname.startsWith('/settings') &&
      !request.nextUrl.pathname.startsWith('/my-routes') &&
      !request.nextUrl.pathname.startsWith('/create-route')) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Check verification status for route creation
  if (request.nextUrl.pathname.startsWith('/create-route')) {
    const { data: userData, error } = await supabase
      .from('profiles')
      .select('is_verified')
      .eq('id', session.user.id)
      .single()
    
    // If user is not verified, redirect to a notification page
    if (!userData?.is_verified) {
      return NextResponse.redirect(new URL('/verification-required', request.url))
    }
  }

  return response
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