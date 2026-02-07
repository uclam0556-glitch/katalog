import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // 1. Check if the requested path is relevant for admin protection
    const path = request.nextUrl.pathname;

    // Define paths
    const isLoginPage = path === '/admin/login';
    const isAdminPath = path.startsWith('/admin');

    // get the token from cookies
    const isAuthenticated = request.cookies.has('admin_auth');

    // 2. Logic:
    // If trying to access admin pages (excluding login) and NOT authenticated -> Redirect to Login
    if (isAdminPath && !isLoginPage && !isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If trying to access Login page regarding authentication -> Redirect to Dashboard
    if (isLoginPage && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/admin/:path*',
}
