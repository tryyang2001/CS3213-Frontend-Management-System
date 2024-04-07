import { useUserContext } from "@/contexts/user-context";
import userService from "@/helpers/user-service/api-wrapper";
import { NextRequest, NextResponse } from "next/server";
import { toast } from "react-toastify";

export const config = {
  matchers: "/:path*",
};

export default function middleware(request: NextRequest) {
  const publicRoutes = ["/_next", "/public"];
  const loggedInRequiredRoutes = ["/user", "/assignments", "/dashboard"];
  const redirectRoutes = ["/"];
  const { user } = useUserContext();

  const path = request.nextUrl.pathname;

  // public routes do not need to be authenticated/reroute
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // TODO: check if user is authenticated, and redirect to login page if not
  if (loggedInRequiredRoutes.some((route) => path.startsWith(route))) {
    if (user) {
        const validated = await userService.validateUser(user.uid);
        if (!validated) {
            toast.error("Fail to validate your identity, you need to login again");
            return NextResponse.redirect(new URL("/login"));
        }
    } else {
        toast.error("You must login first to access this page");
        return NextResponse.redirect(new URL("/login"));
    }
    return NextResponse.next();
  }
  // redirect to dashboard page if home page is accessed
  if (redirectRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
}