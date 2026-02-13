import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/play", "/leaderboard", "/my-predictions", "/history"];
  const isRouteProtected = protectedRoutes.includes(pathname);

  try {
    const cookieHeader = req.headers.get("cookie");
    const response = await fetch(
      'https://api.countersite.gg/auth/me',
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader ?? "",
        },
      }
    );

    const data = await response.json();

    // KRITIČNO - čuvaj Set-Cookie header da bi ga vratio browseru
    const setCookieHeader = response.headers.get("set-cookie");

    if (isRouteProtected) {
      if (data.loggedIn) {
        const nextResponse = NextResponse.next();
        // Prosleđuj Set-Cookie ako postoji
        if (setCookieHeader) {
          nextResponse.headers.set("set-cookie", setCookieHeader);
        }
        return nextResponse;
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (data.loggedIn) {
      const redirectResponse = NextResponse.redirect(new URL("/play", req.url));
      if (setCookieHeader) {
        redirectResponse.headers.set("set-cookie", setCookieHeader);
      }
      return redirectResponse;
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const nextResponse = NextResponse.next();
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }
    return nextResponse;

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
