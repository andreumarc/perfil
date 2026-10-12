import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySession } from "@/lib/auth/token";

/**
 * Proxy (antes middleware): protege /admin y /api/admin.
 * La verificación aquí es criptográfica (JWT firmado con AUTH_SECRET), sin BD.
 * El layout del panel vuelve a comprobar en BD que el usuario sigue activo.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isAdminArea) return NextResponse.next();

  const isPublicAdminPage = pathname === "/admin/login" || pathname === "/admin/setup";
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token, process.env.AUTH_SECRET);

  if (isPublicAdminPage) {
    if (session && pathname === "/admin/login") return NextResponse.redirect(new URL("/admin", request.url));
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
