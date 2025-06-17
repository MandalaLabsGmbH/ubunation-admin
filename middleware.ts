import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

 const protectedPathPatterns = [
  /^\/purchase(\/.*)?$/, // Matches /purchase and any sub-path like /purchase/confirm
  /^\/[a-zA-Z0-9_-]+_collection\/collectible\/(\d+)(\/.*)?$/, // Matches /lion_collection/collectible/1, etc.
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedPathPatterns.some(pattern => pattern.test(pathname));

  // If a user tries to go to the old /login or /main pages, redirect to root.
  if (pathname.startsWith('/login') || pathname.startsWith('/main')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!token && isProtectedRoute) {
    // ...redirect them to the root page. Any action on the root page
    // that requires login will then trigger the modal.
    return NextResponse.redirect(new URL('/', req.url));
  }
 
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)',
  ],
};
