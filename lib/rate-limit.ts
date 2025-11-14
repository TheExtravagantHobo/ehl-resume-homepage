// lib/rate-limit.ts

import { NextRequest, NextResponse } from 'next/server'

// ============================================
// IN-MEMORY RATE LIMITER
// ============================================

interface RateLimitOptions {
  requests: number
  windowMs: number
  identifier?: (req: NextRequest) => string
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    }
  }

  check(identifier: string, requests: number, windowMs: number): {
    allowed: boolean
    remaining: number
    resetTime: number
  } {
    const now = Date.now()
    const resetTime = now + windowMs

    if (!this.store[identifier] || this.store[identifier].resetTime < now) {
      // New window
      this.store[identifier] = {
        count: 1,
        resetTime: resetTime
      }
      return {
        allowed: true,
        remaining: requests - 1,
        resetTime: resetTime
      }
    }

    const entry = this.store[identifier]
    
    if (entry.count >= requests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    // Increment counter
    entry.count++
    return {
      allowed: true,
      remaining: requests - entry.count,
      resetTime: entry.resetTime
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Singleton instance
const rateLimiterInstance = new RateLimiter()

// ============================================
// RATE LIMIT MIDDLEWARE
// ============================================

/**
 * Create a rate limiter for API routes
 */
export function rateLimit(options: RateLimitOptions) {
  const {
    requests = 10,
    windowMs = 60 * 1000,
    identifier = (req) => {
      // Default: Use IP address as identifier
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return ip
    }
  } = options

  return async function rateLimitMiddleware(req: NextRequest) {
    const id = identifier(req)
    const result = rateLimiterInstance.check(id, requests, windowMs)

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds`,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': requests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // Continue with the request
    return null
  }
}

// ============================================
// PRESET RATE LIMITERS
// ============================================

// Strict limiter for auth endpoints
export const authRateLimit = rateLimit({
  requests: 5,
  windowMs: 15 * 60 * 1000 // 5 requests per 15 minutes
})

// Standard limiter for API endpoints
export const apiRateLimit = rateLimit({
  requests: 30,
  windowMs: 60 * 1000 // 30 requests per minute
})

// Lenient limiter for read-only endpoints
export const readRateLimit = rateLimit({
  requests: 100,
  windowMs: 60 * 1000 // 100 requests per minute
})

// Upload limiter for file uploads
export const uploadRateLimit = rateLimit({
  requests: 10,
  windowMs: 60 * 60 * 1000 // 10 uploads per hour
})

// ============================================
// HELPER FUNCTION FOR EASY USE
// ============================================

/**
 * Apply rate limiting to an API handler
 */
export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  limiter = apiRateLimit
): Promise<NextResponse> {
  const rateLimitResponse = await limiter(req)
  
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  return handler()
}