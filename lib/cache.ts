// lib/cache.ts

/**
 * Simple in-memory cache for Next.js
 * For production, consider Redis or Upstash
 */

interface CacheEntry {
    value: any
    expiry: number
  }
  
  class MemoryCache {
    private store: Map<string, CacheEntry> = new Map()
    private cleanupInterval: NodeJS.Timeout | null = null
  
    constructor() {
      // Clean up expired entries every 5 minutes
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, 5 * 60 * 1000)
    }
  
    /**
     * Get value from cache
     */
    async get<T = any>(key: string): Promise<T | null> {
      const entry = this.store.get(key)
      
      if (!entry) {
        return null
      }
  
      if (Date.now() > entry.expiry) {
        this.store.delete(key)
        return null
      }
  
      return entry.value as T
    }
  
    /**
     * Set value in cache with TTL in seconds
     */
    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
      const expiry = Date.now() + (ttl * 1000)
      this.store.set(key, { value, expiry })
    }
  
    /**
     * Delete specific key from cache
     */
    async delete(key: string): Promise<void> {
      this.store.delete(key)
    }
  
    /**
     * Delete all keys matching pattern
     */
    async deletePattern(pattern: string): Promise<void> {
      const regex = new RegExp(pattern.replace('*', '.*'))
      
      for (const key of this.store.keys()) {
        if (regex.test(key)) {
          this.store.delete(key)
        }
      }
    }
  
    /**
     * Clear entire cache
     */
    async clear(): Promise<void> {
      this.store.clear()
    }
  
    /**
     * Get cache size
     */
    size(): number {
      return this.store.size
    }
  
    /**
     * Clean up expired entries
     */
    private cleanup(): void {
      const now = Date.now()
      
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.expiry) {
          this.store.delete(key)
        }
      }
    }
  
    /**
     * Destroy cache and clear intervals
     */
    destroy(): void {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval)
      }
      this.store.clear()
    }
  }
  
  // Export singleton instance
  export const cache = new MemoryCache()
  
  // Default export for module compatibility
  export default cache
  
  // ============================================
  // CACHE UTILITIES
  // ============================================
  
  /**
   * Cache wrapper for async functions
   */
  export function withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    keyGenerator: (...args: Parameters<T>) => string,
    ttl: number = 3600
  ): T {
    return (async (...args: Parameters<T>) => {
      const key = keyGenerator(...args)
      
      // Try to get from cache
      const cached = await cache.get(key)
      if (cached !== null) {
        console.log(`Cache hit: ${key}`)
        return cached
      }
      
      // Execute function and cache result
      console.log(`Cache miss: ${key}`)
      const result = await fn(...args)
      await cache.set(key, result, ttl)
      
      return result
    }) as T
  }
  
  /**
   * Invalidate cache decorator
   */
  export function invalidatesCache(patterns: string[]) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const method = descriptor.value
      
      descriptor.value = async function (...args: any[]) {
        const result = await method.apply(this, args)
        
        // Invalidate cache patterns after successful execution
        for (const pattern of patterns) {
          await cache.deletePattern(pattern)
        }
        
        return result
      }
    }
  }
  
  // ============================================
  // REACT HOOKS (Client-side)
  // ============================================
  
  /**
   * React hook for cached data fetching
   */
  export function useCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 3600
  ) {
    // This is a simplified version - for production, use SWR or React Query
    // This example just shows the concept
    
    const getCached = async (): Promise<T | null> => {
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(key)
        if (cached) {
          const { value, expiry } = JSON.parse(cached)
          if (Date.now() < expiry) {
            return value
          }
        }
      }
      return null
    }
    
    const setCached = (value: T) => {
      if (typeof window !== 'undefined') {
        const expiry = Date.now() + (ttl * 1000)
        sessionStorage.setItem(key, JSON.stringify({ value, expiry }))
      }
    }
    
    return { getCached, setCached }
  }