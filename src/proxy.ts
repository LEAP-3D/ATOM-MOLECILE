import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Webhook замыг Clerk-ийн хамгаалалтаас чөлөөлөх (Нээлттэй болгох)
const isPublicRoute = createRouteMatcher(["/", "/api/webhooks/clerk(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Хэрэв Public зам биш бол заавал нэвтрэхийг шаардана
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
