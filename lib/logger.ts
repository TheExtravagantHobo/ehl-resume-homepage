// lib/logger.ts

/**
 * Simple logger for production
 * Can be replaced with Winston, Pino, or other logging libraries
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logLevel: LogLevel = this.isDevelopment ? 'debug' : 'info'

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.logLevel]
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, data } = entry
    const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`
    
    if (data) {
      return `${base} ${JSON.stringify(data, null, 2)}`
    }
    
    return base
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error) {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
    }

    const formatted = this.formatLog(entry)

    switch (level) {
      case 'debug':
        console.debug(formatted)
        break
      case 'info':
        console.log(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
        console.error(formatted, error?.stack)
        break
    }

    // In production, send to logging service
    if (!this.isDevelopment && level === 'error') {
      this.sendToLoggingService(entry)
    }
  }

  private sendToLoggingService(entry: LogEntry) {
    // Implement integration with logging service
    // Examples: LogRocket, Sentry, DataDog, New Relic
    
    // For now, we'll just store critical errors in a local array
    // In production, replace this with actual service integration
    if (typeof window !== 'undefined') {
      const errors = JSON.parse(
        sessionStorage.getItem('app_errors') || '[]'
      )
      errors.push({
        ...entry,
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.shift()
      }
      sessionStorage.setItem('app_errors', JSON.stringify(errors))
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, error?: Error | any, data?: any) {
    const err = error instanceof Error ? error : new Error(String(error))
    this.log('error', message, data, err)
  }

  // Specialized logging methods
  
  api(method: string, endpoint: string, data?: any) {
    this.info(`API ${method} ${endpoint}`, data)
  }

  db(operation: string, table: string, data?: any) {
    this.debug(`DB ${operation} ${table}`, data)
  }

  auth(action: string, userId?: string, data?: any) {
    this.info(`AUTH ${action}`, { userId, ...data })
  }

  perf(operation: string, duration: number, data?: any) {
    const level = duration > 1000 ? 'warn' : 'debug'
    this.log(level, `PERF ${operation} took ${duration}ms`, data)
  }

  // Error tracking helper
  track(error: Error, context?: any) {
    this.error('Tracked Error', error, context)
    
    // Send to error tracking service in production
    if (!this.isDevelopment) {
      // Example: Sentry.captureException(error, { extra: context })
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// ============================================
// PERFORMANCE MONITORING
// ============================================

export class PerfMonitor {
  private marks: Map<string, number> = new Map()

  start(label: string) {
    this.marks.set(label, performance.now())
  }

  end(label: string, warnThreshold?: number) {
    const start = this.marks.get(label)
    if (!start) {
      logger.warn(`PerfMonitor: No start mark for ${label}`)
      return 0
    }

    const duration = performance.now() - start
    this.marks.delete(label)

    if (warnThreshold && duration > warnThreshold) {
      logger.warn(`Performance warning: ${label} took ${duration}ms (threshold: ${warnThreshold}ms)`)
    } else {
      logger.perf(label, duration)
    }

    return duration
  }

  async measure<T>(label: string, fn: () => Promise<T>, warnThreshold?: number): Promise<T> {
    this.start(label)
    try {
      const result = await fn()
      return result
    } finally {
      this.end(label, warnThreshold)
    }
  }
}

export const perf = new PerfMonitor()