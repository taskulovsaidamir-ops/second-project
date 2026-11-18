import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "salary_super_secure_jwt_secret_key_change_in_production_32chars"
);

const COOKIE_NAME = "salary_session";

// Public pages that unauthenticated users can visit
const PUBLIC_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip static resources and API internal routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If request contains ?reset or ?logout, clear cookie and redirect to /login
  if (searchParams.has("reset") || searchParams.has("logout")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.search = ""; // remove query params
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (payload?.userId) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPublicPage = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // If trying to access protected page while not authenticated -> redirect to login
  if (!isPublicPage && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
