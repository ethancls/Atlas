export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/discover", "/shows/:path*", "/movies/:path*", "/api/:path*", '/favorites/:path*', '/persons/:path*'],
};