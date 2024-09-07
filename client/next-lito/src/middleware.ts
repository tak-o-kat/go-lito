import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    // Get the current path
    const url = req.nextUrl.clone();
    const currentPath = url.pathname;

    // Construct the login URL with a redirect parameter
    url.pathname = "/login";
    // url.searchParams.set("redirectTo", currentPath);

    return NextResponse.redirect(url);
  }
  // If there is a session, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|signup|login|renew).*)"],
};
