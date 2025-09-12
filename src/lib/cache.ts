import { LRUCache } from 'lru-cache'

interface CacheOptions {
  max: number
  ttl: number
}

const cacheOptions: CacheOptions = {
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
}

// Create a generic type for the cache
const cache = new LRUCache<string, any>(cacheOptions)

export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  try {
    const cached = cache.get(key)
    if (cached) return cached as T

    const result = await fn()
    if (result !== undefined && result !== null) {
      cache.set(key, result, { ttl: ttl || cacheOptions.ttl })
    }
    return result
  } catch (error) {
    console.error('Cache operation failed:', error)
    return fn() // Fallback to original function if cache fails
  }
}

// Example usage
const data = await withCache(
  'cache-key',
  async () => {
    // Your async operation here
    return { someData: 'value' }
  },
  60000 // Optional TTL in milliseconds
)