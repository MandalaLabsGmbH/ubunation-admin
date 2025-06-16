import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Get the session token from the request
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/login');

  // If the user is authenticated (has a token)
  if (token) {
    // and tries to access an authentication page (like /login),
    // redirect them to the root page.
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  // If the user is not authenticated (no token)
  else {
    // and is trying to access a protected page (any page that isn't for auth),
    // redirect them to the login page.
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If none of the above conditions are met, allow the request to continue.
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * This ensures the middleware doesn't interfere with essential assets and APIs.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};