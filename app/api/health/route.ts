// app/api/health/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/services/resume.service'
import { cache } from '@/lib/cache'
import { logger } from '@/lib/logger'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: {
      status: 'up' | 'down'
      latency?: number
      error?: string
    }
    cache: {
      status: 'up' | 'down'
      size?: number
      error?: string
    }
    filesystem: {
      status: 'up' | 'down'
      error?: string
    }
  }
  environment: {
    node: string
    deployment: string
  }
}

async function checkDatabase(): Promise<HealthCheck['checks']['database']> {
  try {
    const start = performance.now()
    await prisma.$queryRaw`SELECT 1`
    const latency = Math.round(performance.now() - start)
    
    return { status: 'up', latency }
  } catch (error) {
    logger.error('Health check: Database is down', error as Error)
    return { 
      status: 'down', 
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Database connection failed'
    }
  }
}

async function checkCache(): Promise<HealthCheck['checks']['cache']> {
  try {
    // Test cache operations
    await cache.set('health-check', 'ok', 10)
    const value = await cache.get('health-check')
    
    if (value !== 'ok') {
      throw new Error('Cache read/write test failed')
    }
    
    await cache.delete('health-check')
    
    return { status: 'up', size: cache.size() }
  } catch (error) {
    logger.error('Health check: Cache is down', error as Error)
    return { 
      status: 'down',
      error: process.env.NODE_ENV === 'development'
        ? (error as Error).message
        : 'Cache operation failed'
    }
  }
}

async function checkFilesystem(): Promise<HealthCheck['checks']['filesystem']> {
  try {
    // Check if public/uploads directory is accessible
    const fs = require('fs/promises')
    const path = require('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    await fs.access(uploadDir)
    
    return { status: 'up' }
  } catch (error) {
    // Create directory if it doesn't exist
    try {
      const fs = require('fs/promises')
      const path = require('path')
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })
      
      return { status: 'up' }
    } catch (mkdirError) {
      logger.error('Health check: Filesystem is not writable', mkdirError as Error)
      return { 
        status: 'down',
        error: 'Upload directory not accessible'
      }
    }
  }
}

export async function GET(request: NextRequest) {
  const startTime = process.hrtime()
  
  try {
    // Run all health checks in parallel
    const [database, cacheCheck, filesystem] = await Promise.all([
      checkDatabase(),
      checkCache(),
      checkFilesystem()
    ])
    
    // Calculate overall status
    const allChecks = [database.status, cacheCheck.status, filesystem.status]
    let overallStatus: HealthCheck['status'] = 'healthy'
    
    if (allChecks.some(s => s === 'down')) {
      overallStatus = allChecks.every(s => s === 'down') ? 'unhealthy' : 'degraded'
    }
    
    // Calculate uptime
    const [seconds] = process.hrtime(startTime)
    
    const health: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database,
        cache: cacheCheck,
        filesystem
      },
      environment: {
        node: process.version,
        deployment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown'
      }
    }
    
    // Log health check results if not healthy
    if (overallStatus !== 'healthy') {
      logger.warn('Health check degraded', health)
    }
    
    // Return appropriate status code
    const statusCode = overallStatus === 'healthy' ? 200 : 
                       overallStatus === 'degraded' ? 503 : 500
    
    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    logger.error('Health check failed completely', error as Error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}

// Simple liveness check - just returns 200 if service is running
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}