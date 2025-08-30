// middleware.ts (at root level)
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Custom logic can go here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow public access to resume page
        if (req.nextUrl.pathname === '/resume' || req.nextUrl.pathname === '/') {
          return true
        }
        
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token
        }
        
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/resume']
}