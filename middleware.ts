import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

//Public Routes define routes that will not require authentication
// Example: ['/dashboard'] will give access to that page without authentication
const isPublicRoute = createRouteMatcher([
  // '/sign-in(.*)',
  // '/sign-up(.*)',
  // '/browse',
  '/(.*)', //all routes public
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
