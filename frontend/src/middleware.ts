import { NextRequest, NextResponse } from "next/server";

export const config = {
  matchers: "/:path*",
};

export default function middleware(request: NextRequest) {
  const publicRoutes = ["/_next", "/public"];
  const redirectRoutes = ["/"];

  const path = request.nextUrl.pathname;

  // public routes do not need to be authenticated/reroute
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // TODO: check if user is authenticated, and redirect to login page if not

  // redirect to dashboard page if home page is accessed
  if (redirectRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}
