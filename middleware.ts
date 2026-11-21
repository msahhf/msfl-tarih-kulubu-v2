import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getEncodedKey(): Uint8Array {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return new TextEncoder().encode(secretKey);
}

const protectedRoutes = ["/hesap", "/blog/olustur"];
const adminRoutes = ["/admin"];

/**
 * Bağımsız dergi yayınında (NEXT_PUBLIC_MAGAZINE_SITE=1) yalnızca dergi
 * yolları açıktır; kulüp sitesine ait diğer sayfalar dergi ana sayfasına
 * yönlendirilir.
 */
const MAGAZINE_SITE = process.env.NEXT_PUBLIC_MAGAZINE_SITE === "1";
const MAGAZINE_ALLOWED = ["/dergi", "/api/dergi", "/giris", "/kayit"];

function isMagazinePath(path: string): boolean {
  return (
    path === "/" ||
    MAGAZINE_ALLOWED.some(
      (allowed) => path === allowed || path.startsWith(`${allowed}/`)
    )
  );
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (MAGAZINE_SITE && !isMagazinePath(path)) {
    return NextResponse.redirect(new URL("/dergi", request.url));
  }

  // Admin login page must stay reachable for anonymous users (otherwise
  // the /admin/* matcher redirects it to itself in an infinite loop).
  if (path.startsWith("/admin/giris")) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    const cookie = request.cookies.get("auth_token")?.value;

    if (!cookie) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/giris", request.url));
      }
      return NextResponse.redirect(new URL("/giris", request.url));
    }

    try {
      const { payload } = await jwtVerify(cookie, getEncodedKey(), {
        algorithms: ["HS256"],
      });

      if (isAdminRoute && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (_error) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/giris", request.url));
      }
      return NextResponse.redirect(new URL("/giris", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Tüm sayfa istekleri (statik dosyalar ve API yolları hariç), böylece
  // dergi yayınındaki yol koruması da her sayfada çalışır.
  matcher: [
    "/((?!_next/|_vercel/|img/|pdf/|api/|favicon|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
