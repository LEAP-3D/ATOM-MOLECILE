import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Webhook замыг "Нээлттэй" гэж бүртгэх
const isPublicRoute = createRouteMatcher([
  "/api/routes/user/create-user(.*)",
  "/",
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Хэрэв нээлттэй зам биш бол Clerk-ийн хамгаалалтыг ажиллуулна
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Таны өмнөх нарийн matcher:
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
