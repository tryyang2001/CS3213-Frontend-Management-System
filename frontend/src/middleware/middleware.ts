import { useUserContext } from "@/contexts/user-context";
import Cookies from 'js-cookie';
import { NextRequest, NextResponse } from "next/server";
import { toast } from "react-toastify";

export const config = {
  matchers: "/:path*",
};

export default function Middleware(request: NextRequest) {
  const publicRoutes = ["/_next", "/public"];
  const loggedInRequiredRoutes = ["/user", "/assignments"];
  const redirectRoutes = ["/"];
  const { user } = useUserContext();
  console.log(user);
  const path = request.nextUrl.pathname;

  // public routes do not need to be authenticated/reroute
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // redirect to login page if no user context is found when accessing authentication-required route
  if (loggedInRequiredRoutes.some((route) => path.startsWith(route))) {
    console.log("u reached middleware");
    if (!user || !Cookies.get('token')) {
        toast.error("You must login first to access this page");
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
  
  // redirect to dashboard page if home page is accessed
  if (redirectRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}