// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // Public frontend routes (no login needed)
// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/auth/login(.*)",
//   "/auth/register(.*)",
//   "/about",
//   "/contact",
// ]);

// // Protected frontend routes (login required)
// const isProtectedRoute = createRouteMatcher([
//   "/cart(.*)",
//   "/orders(.*)",
//   "/appointments(.*)",
//   "/products(.*)",
//   "/doctors(.*)",
//   "/dashboard(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   // Do not protect public pages
//   if (isPublicRoute(req)) return;

//   // Protect only frontend pages — NOT `/api/**`
//   if (isProtectedRoute(req) && !req.nextUrl.pathname.startsWith("/api")) {
//     const session = await auth.protect();
//     const userId = session.userId;

//     // Optional dashboard restriction
//     if (
//       req.nextUrl.pathname.startsWith("/dashboard") &&
//       userId !== "user_35Y4gPQomnQtk8KFTS3zJg3jPN7"
//     ) {
//       return new Response("🚫 Access denied", { status: 403 });
//     }
//   }
// });

// // ⛔ Stop middleware from running on `/api/**`
// // 🔥 This is the KEY FIX that solves 405 for your cart
// export const config = {
//   matcher: [
//     // Apply middleware only to frontend routes
//     "/((?!api|_next|.*\\..*).*)",
//   ],

// };




// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/auth/login(.*)",
//   "/auth/register(.*)",
//   "/about",
//   "/contact",
// ]);

// const isProtectedRoute = createRouteMatcher([
//   "/cart(.*)",
//   "/orders(.*)",
//   "/appointments(.*)",
//   "/products(.*)",
//   "/doctors(.*)",
//   "/dashboard(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const path = req.nextUrl.pathname;

//   // ❌ NEVER run middleware on API routes
//   if (path.startsWith("/api")) return;

//   // Public routes do not need auth
//   if (isPublicRoute(req)) return;

//   // Protect frontend routes
//   if (isProtectedRoute(req)) {
//     const { userId } = await auth.protect();

//     if (
//       path.startsWith("/dashboard") &&
//       userId !== "user_35Y4gPQomnQtk8KFTS3zJg3jPN7"
//     ) {
//       return new Response("🚫 Access denied", { status: 403 });
//     }
//   }
// });

// // ⛔ VERY IMPORTANT FOR VERCEL!!!
// export const config = {
//   matcher: [
//     // apply middleware ONLY to ROUTES THAT ARE *NOT* API
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/products(.*)",
  "/api/webhook(.*)",
]);

const isIgnoredRoute = createRouteMatcher([
  "/api/cart(.*)",      // allow cart without auth
  "/api/products(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // ignore routes (no middleware)
  if (isIgnoredRoute(req)) return;

  // allow public pages
  if (isPublicRoute(req)) return;

  // protect everything else
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|favicon.ico).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
