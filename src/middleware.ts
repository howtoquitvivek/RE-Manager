import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "re_manager_auth";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session && path !== "/" && !req.nextUrl.searchParams.has("sync")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
