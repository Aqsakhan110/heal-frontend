// 
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/login(.*)",
  "/auth/register(.*)",
  "/about",
  "/contact",
]);

// Protected routes
const isProtectedRoute = createRouteMatcher([
  "/cart(.*)",
  "/orders(.*)",
  "/appointments(.*)", // ✅ only protected now
  "/products(.*)",
  "/doctors(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  if (isProtectedRoute(req)) {
    const session = await auth.protect();
    const userId = session.userId;

    // Restrict dashboard to a specific user (temporary)
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      userId !== "user_35Y4gPQomnQtk8KFTS3zJg3jPN7"
    ) {
      return new Response("🚫 Access denied", { status: 403 });
      // Or redirect:
      // return Response.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js|png|jpg|svg|ico|woff2?|csv|docx?|xlsx?|zip)).*)",
    "/(api|trpc)(.*)",
  ],
};
