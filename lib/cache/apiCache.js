// Server-side in-memory cache for API responses
// This improves performance by caching frequently accessed data

class ApiCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  /**
   * Get cached data if available and not expired
   * @param {string} key - Cache key
   * @param {number} maxAge - Maximum age in milliseconds (default: 5 minutes)
   * @returns {any|null} Cached data or null
   */
  get(key, maxAge = 5 * 60 * 1000) {
    const cached = this.cache.get(key);
    const timestamp = this.timestamps.get(key);

    if (!cached || !timestamp) {
      return null;
    }

    const age = Date.now() - timestamp;
    if (age > maxAge) {
      // Cache expired, remove it
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return cached;
  }

  /**
   * Set cache data
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
  }

  /**
   * Invalidate cache for a specific key
   * @param {string} key - Cache key
   */
  invalidate(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  /**
   * Invalidate cache by pattern (e.g., all product-related caches)
   * @param {string} pattern - Pattern to match keys
   */
  invalidateByPattern(pattern) {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    });
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Cleanup expired entries (run periodically)
   * @param {number} maxAge - Maximum age in milliseconds
   */
  cleanup(maxAge = 30 * 60 * 1000) {
    const now = Date.now();
    const keys = Array.from(this.timestamps.keys());
    
    keys.forEach(key => {
      const timestamp = this.timestamps.get(key);
      if (now - timestamp > maxAge) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    });
  }
}

// Create a global instance
let apiCache;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve cache across hot reloads
  if (!global._apiCache) {
    global._apiCache = new ApiCache();
  }
  apiCache = global._apiCache;
} else {
  // In production, create a new instance
  apiCache = new ApiCache();
}

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000);
}

export default apiCache;

// Cache duration constants
export const CACHE_DURATION = {
  STATIC: 30 * 60 * 1000,      // 30 minutes for static data (products, categories)
  DYNAMIC: 5 * 60 * 1000,       // 5 minutes for dynamic data (reviews, stock)
  USER_SPECIFIC: 1 * 60 * 1000, // 1 minute for user data (cart, orders)
  SHORT: 30 * 1000,             // 30 seconds for frequently changing data
  NONE: 0                       // No cache
};

/**
 * Helper function to generate cache headers for responses
 * @param {number} maxAge - Maximum age in seconds
 * @returns {object} Headers object
 */
export function getCacheHeaders(maxAge = 300) {
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    'CDN-Cache-Control': `public, max-age=${maxAge}`,
    'Vercel-CDN-Cache-Control': `public, max-age=${maxAge}`,
  };
}
