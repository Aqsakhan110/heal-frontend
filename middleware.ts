import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public frontend routes (no login needed)
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/login(.*)",
  "/auth/register(.*)",
  "/about",
  "/contact",
]);

// Protected frontend routes (login required)
const isProtectedRoute = createRouteMatcher([
  "/cart(.*)",
  "/orders(.*)",
  "/appointments(.*)",
  "/products(.*)",
  "/doctors(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Do not protect public pages
  if (isPublicRoute(req)) return;

  // Protect only frontend pages — NOT `/api/**`
  if (isProtectedRoute(req) && !req.nextUrl.pathname.startsWith("/api")) {
    const session = await auth.protect();
    const userId = session.userId;

    // Optional dashboard restriction
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      userId !== "user_35Y4gPQomnQtk8KFTS3zJg3jPN7"
    ) {
      return new Response("🚫 Access denied", { status: 403 });
    }
  }
});

// ⛔ Stop middleware from running on `/api/**`
// 🔥 This is the KEY FIX that solves 405 for your cart
export const config = {
  matcher: [
    // Apply middleware only to frontend routes
    "/((?!api|_next|.*\\..*).*)",
  ],
};
