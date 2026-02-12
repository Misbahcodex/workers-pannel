import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/worker", req.url));
    }
    if (path.startsWith("/worker") && token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => !!token }, pages: { signIn: "/login" } }
);

export const config = {
  matcher: ["/worker/:path*", "/admin/:path*"],
};
