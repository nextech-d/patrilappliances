import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminToken } from "./app/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isProtected =
    (pathname.startsWith("/admin") && !isLoginPage) ||
    (pathname.startsWith("/api/admin") && !isLoginApi);

  if (!isProtected) {
    return NextResponse.next();
  }

  const expected = await getAdminToken();
  if (!expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Admin is not configured." },
        { status: 503 }
      );
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (session !== expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
