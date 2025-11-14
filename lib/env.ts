// lib/env.ts

import { z } from 'zod'

/**
 * Server-side environment variables schema
 */
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1, 'Database URL is required'),
  
  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Vercel environment (optional)
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  VERCEL_URL: z.string().optional(),
  
  // Optional services
  SENTRY_DSN: z.string().url().optional(),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
})

/**
 * Client-side environment variables schema
 * Must be prefixed with NEXT_PUBLIC_
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_ALLOW_EXTERNAL_IMAGES: z.boolean().optional(),
})

/**
 * Parse and validate server environment variables
 */
function validateServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env)
  
  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
    )
    throw new Error('Invalid environment variables')
  }
  
  return parsed.data
}

/**
 * Parse and validate client environment variables
 */
function validateClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ALLOW_EXTERNAL_IMAGES: process.env.NEXT_PUBLIC_ALLOW_EXTERNAL_IMAGES === 'true',
  })
  
  if (!parsed.success) {
    console.error(
      '❌ Invalid client environment variables:',
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
    )
    throw new Error('Invalid client environment variables')
  }
  
  return parsed.data
}

// Validate environment variables at module load time
// This will throw an error during build if vars are missing
let serverEnv: z.infer<typeof serverEnvSchema> | undefined
let clientEnv: z.infer<typeof clientEnvSchema>

// Only validate server env on server side
if (typeof window === 'undefined') {
  serverEnv = validateServerEnv()
}

// Client env can be validated on both sides
clientEnv = validateClientEnv()

/**
 * Type-safe environment variables
 * Import this instead of using process.env directly
 */
export const env = {
  // Server-only variables
  ...(serverEnv || {}),
  
  // Client-side variables
  ...clientEnv,
  
  // Computed variables
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // App URL with fallback
  appUrl: clientEnv.NEXT_PUBLIC_APP_URL || 
          (typeof window !== 'undefined' ? window.location.origin : 
           serverEnv?.VERCEL_URL ? `https://${serverEnv.VERCEL_URL}` : 
           'http://localhost:3000'),
} as const

// Export types
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
export type Env = typeof env