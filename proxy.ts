import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth-cookies";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if ((pathname === "/login" || pathname === "/") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"]
};
