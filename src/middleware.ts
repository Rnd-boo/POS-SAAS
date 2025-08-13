import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { environment } from "./configs/environment";

// Helper function to create JWT secret key
const getJwtSecretKey = () => {
  const secret = environment.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("client_session")?.value;

  // If no token → go to login
  if (!token) {
    if (request.nextUrl.pathname !== "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If token exists, verify it
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
  } catch (err) {
    // Token invalid/expired → clear cookie & go to login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const res = NextResponse.redirect(url);
    res.cookies.delete("client_session");
    return res;
  }

  // If logged in and tries to visit /login → send to home
  if (request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
