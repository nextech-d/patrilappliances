import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminToken } from "./app/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const rest = pathname.replace(/^\/admin/, "") || "/";
    const target = request.nextUrl.clone();
    target.pathname = `/manage${rest === "/" ? "" : rest}`;
    return NextResponse.redirect(target);
  }

  const isLoginApi = pathname === "/api/admin/login";
  const isProtected = pathname.startsWith("/api/admin") && !isLoginApi;

  if (!isProtected) {
    return NextResponse.next();
  }

  const expected = await getAdminToken();
  if (!expected) {
    return NextResponse.json(
      { success: false, message: "Admin is not configured." },
      { status: 503 }
    );
  }

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (session !== expected) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
