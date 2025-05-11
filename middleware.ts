import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  const isLoggedIn = !!session
  const isAuthPage = req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/signup"
  const isProtectedRoute = ["/dashboard", "/course", "/grades", "/browse-courses", "/profile"].some((path) =>
    req.nextUrl.pathname.startsWith(path),
  )

  // Handle redirects
  if (!isLoggedIn && isProtectedRoute) {
    // Redirect to login if accessing protected route while not logged in
    console.log("Middleware: Not logged in, redirecting to login page")
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (isLoggedIn && isAuthPage) {
    // Redirect to dashboard if accessing login page while logged in
    console.log("Middleware: Already logged in, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/signup",
    "/dashboard/:path*",
    "/course/:path*",
    "/grades/:path*",
    "/browse-courses/:path*",
    "/profile/:path*",
  ],
}
