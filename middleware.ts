import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname.startsWith('/login');
  const isRootPage = pathname === '/';

  // --- Logged-Out User Logic ---
  // If the user is not authenticated...
  if (!token) {
    // ...and they are trying to access any page that is NOT the login page or the root page...
    if (!isLoginPage && !isRootPage) {
      // ...redirect them to the root page. This fulfills Requirement #2.
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // --- Logged-In User Logic ---
  // If the user is authenticated...
  if (token) {
    // ...and they try to visit the login page...
    if (isLoginPage) {
      // ...redirect them to the main content page, as they are already logged in.
      return NextResponse.redirect(new URL('/main', req.url));
    }
  }
  
  // For all other cases (e.g., a logged-out user visiting '/' or '/login', 
  // or a logged-in user visiting any page except '/login'), allow the request to continue.
  // This fulfills Requirements #1 and #3.
  return NextResponse.next();
}

// The matcher configuration remains the same and is correct.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - any path with a file extension (e.g., .png, .jpg, .svg)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)',
  ],
};
