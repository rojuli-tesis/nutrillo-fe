import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function redirect(request: NextRequest, newDest: string) {
  const isLogin = request.nextUrl.pathname.startsWith("/login");
  if (isLogin && newDest === "/login") {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(newDest, request.url));
}

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const isLogin = request.nextUrl.pathname.startsWith("/login");
  const isInvite = request.nextUrl.pathname.startsWith("/invite");
  const isLogout = request.nextUrl.pathname.startsWith("/logout");
  if (isInvite) {
    return NextResponse.next();
  }
  if (isLogout) {
    const response = NextResponse.next({
      status: 302,
      headers: {
        // redirect to login
        location: request.nextUrl.origin + "/login",
      },
    });
    response.cookies.delete("jwt");
    return response;
  }
  const token = cookies.get("jwt")?.value;
  if (!token) {
    return redirect(request, "/login");
  }
  try {
    const decoded = jwtDecode(token) as { exp: number };
    const expirationDate = new Date(decoded.exp * 1000);
    const isExpired = expirationDate < new Date();

    if (isExpired) {
      return redirect(request, "/login");
    }
  } catch (error) {
    return redirect(request, "/login");
  }
  if (isLogin) {
    return redirect(request, "/");
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
