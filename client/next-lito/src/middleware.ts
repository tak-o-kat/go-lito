import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/actions/session-actions";

const LOGIN_REQUIRED = true;
const MATCHER = LOGIN_REQUIRED
  ? "/((?!_next/static|_next/image|favicon.ico|login).*)"
  : "/:path*";
export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    // Get the current path
    console.log("not logged in: " + session.isLoggedIn);
    const url = req.nextUrl.clone();
    const currentPath = url.pathname;

    // Construct the login URL with a redirect parameter
    url.pathname = "/login";
    url.searchParams.set("redirectTo", currentPath);

    return NextResponse.redirect(url);
  }
  // If there is a session, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"],
};
