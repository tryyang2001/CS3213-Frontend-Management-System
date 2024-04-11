import { NextRequest, NextResponse } from "next/server";

export const config = {
  matchers: "/:path*",
};

export default function middleware(request: NextRequest) {
  const publicRoutes = ["/_next", "/public", "/login", "/sign-up"];
  const redirectRoutes = ["/"];

  const path = request.nextUrl.pathname;

  // public routes do not need to be authenticated/reroute
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get("token");

  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  // redirect to dashboard page if home page is accessed
  if (redirectRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}
