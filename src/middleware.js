import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.pathname;
  const loggedIn = request.cookies.get(`${process.env.NEXT_PUBLIC_NAME}_token`);

  if (!loggedIn && url !== "/login-student" && url !== "/login-teacher" && url !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  } else if ((loggedIn && url === "/") || (loggedIn && url === "/login-student") || (loggedIn && url === "/login-teacher")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/add-student/:path*", "/add-scores/:path*", "/profile/:path*", "/login-student", "/login-teacher", "/"],
};
