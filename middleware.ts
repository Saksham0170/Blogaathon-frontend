import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { useAuth } from "./components/providers/auth-provider";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const UserToken = request.cookies.get("UserToken")?.value;
  const JudgeToken = request.cookies.get("JudgeToken")?.value;
  const AdminToken = request.cookies.get("AdminToken")?.value;
  // console.log('token', token)
  // If accessing dashboard without a token, redirect to login
  if (request.nextUrl.pathname.startsWith("/dashboard/user") && !UserToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/dashboard/judge") && !JudgeToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/dashboard/organizer") && !AdminToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if ( (request.nextUrl.pathname === "/login" ||request.nextUrl.pathname === "/register") &&token) {
    if (JudgeToken) {
      return NextResponse.redirect(new URL("/dashboard/judge", request.url));
    }
    if (UserToken) {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }
    if (AdminToken) {
      return NextResponse.redirect(new URL("/dashboard/organizer", request.url));
    }
    else {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
      //remove the token
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // from the global user state, check the presence of all the feilds if all the feilds are filled then dont show the middlewares

  if (request.nextUrl.pathname.startsWith("/additionalDetails") && !token) {
    //it is problem because if ths user is logged in then he can see this page
    // console.log('user', user)
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If accessing login or register with a token, redirect to dashboard

  // If accessing register without a token, redirect to login
  if (request.nextUrl.pathname === "/register" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
