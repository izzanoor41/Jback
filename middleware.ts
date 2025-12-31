import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/register" && req.nextUrl.pathname !== "/") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (req.auth && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/login', '/register', '/dashboard', '/integrations', '/widgets'],
};
