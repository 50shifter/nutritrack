import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = ["/profile", "/records"];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  if (isProtectedPath && !session) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/auth/signin" || pathname === "/auth/signup") && session) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/records/:path*", "/auth/signin", "/auth/signup"],
};
