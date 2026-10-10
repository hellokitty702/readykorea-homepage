import { NextResponse, type NextRequest } from 'next/server';

// Optimistic check only: send visitors without a session cookie to the login page.
// Pages and Server Actions verify the session themselves (lib/auth/dal.ts).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith('/admin/login') || request.cookies.has('rk_session')) return NextResponse.next();

  const login = new URL('/admin/login/', request.url);
  login.searchParams.set('next', pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
