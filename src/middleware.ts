import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip login page
    if (request.nextUrl.pathname === '/admin-login') {
      return NextResponse.next();
    }

    // Check for admin authentication in cookies
    const adminUser = request.cookies.get('adminUser');
    
    if (!adminUser) {
      // Redirect to admin login if not authenticated
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};


