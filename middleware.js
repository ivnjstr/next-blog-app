// export { default } from "next-auth/middleware"

// export const config = { 
//   // This ensures all routes starting with /admin require login
//   matcher: ["/admin/:path*"] 
// }

import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Optional custom logic here
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = { 
  matcher: ["/admin/:path*"] 
};