import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEYS, CacheKey } from "@/lib/cache/cacheConfig";

// Hook for manual cache management
export function useCacheManager() {
  const queryClient = useQueryClient();

  return {
    // Invalidate specific cache key - forces refetch on next access
    invalidate: (key: CacheKey | string) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },

    // Invalidate multiple cache keys
    invalidateMany: (keys: (CacheKey | string)[]) => {
      keys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },

    // Invalidate all caches
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },

    // Prefetch data before it's needed
    prefetch: async <T>(key: string, fetchFn: () => Promise<T>) => {
      await queryClient.prefetchQuery({
        queryKey: [key],
        queryFn: fetchFn,
      });
    },

    // Set data directly in cache (useful after mutations)
    setData: <T>(key: string, data: T) => {
      queryClient.setQueryData([key], data);
    },

    // Get data from cache without fetching
    getData: <T>(key: string): T | undefined => {
      return queryClient.getQueryData([key]);
    },

    // Remove data from cache
    remove: (key: string) => {
      queryClient.removeQueries({ queryKey: [key] });
    },

    // Check if data exists in cache
    hasData: (key: string): boolean => {
      return queryClient.getQueryData([key]) !== undefined;
    },

    // Refetch specific query
    refetch: (key: string) => {
      queryClient.refetchQueries({ queryKey: [key] });
    },

    // Reset cache to initial state
    reset: () => {
      queryClient.clear();
    },

    // Get all cache keys for debugging
    getCacheKeys: () => CACHE_KEYS,
  };
}

// Export cache keys for easy access
export { CACHE_KEYS } from "@/lib/cache/cacheConfig";
