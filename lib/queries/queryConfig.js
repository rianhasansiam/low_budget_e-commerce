// lib/queries/queryConfig.js

// Cache configuration based on data type - HIGHLY optimized for performance
export const CACHE_CONFIG = {
  // Static data - cache for longer (products, categories don't change often)
  STATIC: {
    staleTime: 60 * 60 * 1000,  // 1 hour - significantly increased for better caching
    gcTime: 2 * 60 * 60 * 1000, // 2 hours - longer garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,       // Don't refetch if data exists
    retry: 2,
    refetchOnReconnect: true,
    // Enable background refetching for seamless updates
    refetchInterval: false,      // Don't auto-refetch unless needed
    refetchIntervalInBackground: false
  },
  
  // Dynamic data - moderate cache (reviews, available stock)
  DYNAMIC: {
    staleTime: 10 * 60 * 1000,   // 10 minutes - increased from 5
    gcTime: 30 * 60 * 1000,      // 30 minutes - increased from 15
    refetchOnWindowFocus: false,
    refetchOnMount: false,       // Don't refetch if data exists
    retry: 1,
    refetchOnReconnect: true,
    refetchInterval: false
  },
  
  // User-specific data - short cache (cart, orders, profile)
  USER_SPECIFIC: {
    staleTime: 2 * 60 * 1000,    // 2 minutes - increased from 1
    gcTime: 10 * 60 * 1000,      // 10 minutes - increased from 5
    refetchOnWindowFocus: true,
    refetchOnMount: false,       // Don't refetch if data exists
    retry: 1,
    refetchOnReconnect: true,
    refetchInterval: false
  },
  
  // No cache for real-time data
  NO_CACHE: {
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 0
  }
};