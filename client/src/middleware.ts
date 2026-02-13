import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/play", "/leaderboard", "/my-predictions", "/history"];
  const isRouteProtected = protectedRoutes.includes(pathname);

  try {
    const cookieHeader = req.headers.get("cookie");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader ?? "",
        },
      }
    );

    const data = await response.json();

    if (isRouteProtected) {
      if (data.loggedIn) return NextResponse.next();
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (data.loggedIn)
      return NextResponse.redirect(new URL("/play", req.url));

    if (pathname === "/")
      return NextResponse.redirect(new URL("/login", req.url));

    return NextResponse.next();
  } catch (error) {
    console.log("Middleware error:", error);

    if (isRouteProtected)
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname === "/")
      return NextResponse.redirect(new URL("/login", req.url));

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
