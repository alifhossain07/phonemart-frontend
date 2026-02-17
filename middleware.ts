import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth token from cookie
  const authToken = request.cookies.get('like_auth_token')?.value;
  
  // If token exists, add it as Authorization header to the request
  if (authToken) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

