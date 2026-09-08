import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const protectedRoute = createRouteMatcher([
  '/home',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/recordings',
  '/personal-room',
  '/ai-chat',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Signed-in users landing on the marketing page go straight to the app.
  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // Signed-out users hitting a protected page get the landing page.
  if (!userId && protectedRoute(req)) {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
