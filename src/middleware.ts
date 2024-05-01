import { getToken } from "next-auth/jwt";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse, type NextFetchEvent } from "next/server";

export default async function middleware(
  req: NextRequestWithAuth,
  event: NextFetchEvent,
) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (isAuthenticated && req.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(
      { success: false, message: "Unauthenticated" },
      { status: 401 },
    );
  }

  return withAuth({
    pages: { signIn: "/signin" },
  })(req, event);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/api/auth/((?:account|password/change).*)",
    "/api/((?!auth).*)",
  ],
};
