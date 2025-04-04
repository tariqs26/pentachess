import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth"

const PROTECTED_ROUTES = ["/game", "/account"]
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"]

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const sessionCookie = getSessionCookie(request)

  if (
    sessionCookie &&
    AUTH_ROUTES.some((path) => requestUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", requestUrl))
  } else if (
    !sessionCookie &&
    !requestUrl.pathname.startsWith("/game/local") &&
    !requestUrl.pathname.startsWith("/game/testing") &&
    PROTECTED_ROUTES.some((path) => requestUrl.pathname.startsWith(path))
  ) {
    const redirectUrl = new URL("/login", requestUrl)
    redirectUrl.searchParams.set("from", requestUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/game/:path*",
    "/account",
    "/login",
    "/register",
    "/forgot-password/:path*",
  ],
}
