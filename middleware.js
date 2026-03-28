export { default } from "next-auth/middleware"

export const config = { 
  // This ensures all routes starting with /admin require login
  matcher: ["/admin/:path*"] 
}