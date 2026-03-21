import { auth } from '@/auth'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

// Routes that require authentication
const protectedPaths = ['/en/shop/download', '/zh/shop/download']

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected) {
    const session = await auth()
    if (!session) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\..*).*)'],
}
