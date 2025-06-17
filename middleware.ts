import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define paths that are publicly accessible to all users
const publicPaths = [
  '/',
  '/login',
  '/about',
  '/vision',
  '/support',
  '/contact_us',
  '/imprint',
  '/terms_of_service',
  '/privacy'
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isPublicPage = publicPaths.some(path => pathname.startsWith(path));
  
  // --- Logged-Out User Logic ---
  // If the user is not authenticated and is trying to access a page that is NOT public...
  if (!token && !isPublicPage) {
    // ...redirect them to the root page.
    return NextResponse.redirect(new URL('/', req.url));
  }

  // --- Logged-In User Logic ---
  // If the user is authenticated and tries to visit the login page...
  if (token && pathname.startsWith('/login')) {
    // ...redirect them to the main content page.
    return NextResponse.redirect(new URL('/main', req.url));
  }
  
  // In all other cases, allow the request to proceed.
  return NextResponse.next();
}

// The matcher configuration remains the same.
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
