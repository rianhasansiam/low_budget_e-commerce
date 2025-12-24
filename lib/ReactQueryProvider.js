
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function ReactQueryProvider({ children }) {
  // ✅ HIGHLY optimized QueryClient configuration
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Aggressive caching for better performance
        staleTime: 5 * 60 * 1000,        // 5 minutes default
        gcTime: 10 * 60 * 1000,          // 10 minutes garbage collection
        retry: 1,                         // Retry failed requests once
        refetchOnWindowFocus: false,      // Don't refetch on window focus
        refetchOnMount: false,            // Don't refetch if data exists
        refetchOnReconnect: true,         // Refetch on network reconnect
        // Network mode
        networkMode: 'online',            // Only fetch when online
      },
      mutations: {
        // Faster mutation retries
        retry: 1,
        retryDelay: 1000,                 // 1 second between retries
        networkMode: 'online',
      },
    },
  }));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Enable React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}