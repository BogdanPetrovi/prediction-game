import backend from "@/services/api/backend";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/play", "/leaderboard", "/my-predictions", "/history"]
  const isRouteProtected = protectedRoutes.includes(pathname)

  try {
    const cookieHeader = req.headers.get('cookie')

    const result = await backend.get('/auth/me', {
      headers: {
        'Cookie': cookieHeader
      }
    })
    
    if(isRouteProtected) {
      if(result.data.loggedIn)
        return NextResponse.next()

      return NextResponse.redirect(new URL('/login', req.url))
    }

    if(result.data.loggedIn)
      return NextResponse.redirect(new URL('/play', req.url))

    if(pathname === '/')
      return NextResponse.redirect(new URL('/login', req.url))

    return NextResponse.next()
  } catch (error) {
    if(error instanceof AxiosError)
      console.log(error.message)

    if(isRouteProtected)
      return NextResponse.redirect(new URL('/login', req.url))

    if(pathname === '/')
      return NextResponse.redirect(new URL('/login', req.url))
    
    return NextResponse.next()
  }
}

export const config = {
  // match all paths except nextjs internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',],
}