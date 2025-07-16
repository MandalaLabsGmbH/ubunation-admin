import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Define paths that are public and do not require authentication.
    const publicPaths = ['/login', '/forgot'];

    // Check if the requested path is one of the public paths.
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // If the path is public, allow the request to proceed.
    if (isPublicPath) {
        return NextResponse.next();
    }

    // For any non-public path, check if the user is an authenticated admin.
    // The `userRole` property is added to the token in your NextAuth configuration.
    if (!token || token.userRole !== 'admin') {
        // If the user is not an authenticated admin, redirect them to the login page.
        const loginUrl = new URL('/login', req.url);
        // Optional: You can add a 'from' parameter to redirect back after login
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If the user is an authenticated admin, allow the request.
    return NextResponse.next();
}

// This config ensures the middleware runs on all routes except for API routes
// and static files, which is necessary for the app to function correctly.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)',
  ],
};