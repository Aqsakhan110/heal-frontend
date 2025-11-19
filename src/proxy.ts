import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (no login required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/login(.*)",
  "/auth/register(.*)",
  "/about",
  "/contact",
  "/api/appointments(.*)"   // 👈 allow API access for testing
]);

// Protected routes (require login)
const isProtectedRoute = createRouteMatcher([
  "/cart(.*)",
  "/orders(.*)",
  "/appointments(.*)",   // frontend appointments page
  "/products(.*)",       // ✅ Medicines page
  "/doctors(.*)"         // ✅ Doctors page
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  if (isProtectedRoute(req)) {
    await auth.protect(); // Clerk will redirect to login if not authenticated
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js|png|jpg|svg|ico|woff2?|csv|docx?|xlsx?|zip)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
