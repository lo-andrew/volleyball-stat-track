import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Public pages that don't require authentication
  const publicPages = ["/login", "/register"];

  // Pages that require authentication
  const protectedPages = [
    "/players",
    "/teams",
    "/games",
    "/addPlayer",
    "/addGame",
    "/addStats",
    "/addTeam",
  ];

  const pathname = req.nextUrl.pathname;

  // Check if it's a protected page route
  const isProtectedPage = protectedPages.some((page) =>
    pathname.startsWith(page)
  );

  // If trying to access protected page without token, redirect to login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If trying to access login/register with valid token, redirect to home
  if (publicPages.some((page) => pathname === page) && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/players/:path*",
    "/teams/:path*",
    "/games/:path*",
    "/addPlayer/:path*",
    "/addGame/:path*",
    "/addStats/:path*",
    "/addTeam/:path*",
    "/login",
    "/register",
  ],
};
