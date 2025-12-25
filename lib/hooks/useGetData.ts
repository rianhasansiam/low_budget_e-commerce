import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

// Fetch all data from an endpoint
export function useGetData<T>(key: string, endpoint: string) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
}

// Fetch single item by ID
export function useGetDataById<T>(key: string, endpoint: string, id: string | null) {
  return useQuery<T>({
    queryKey: [key, id],
    queryFn: async () => {
      const res = await fetch(`${endpoint}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!id,
  });
}

// Infinite scroll - fetch data in batches
export function useInfiniteData<T>(key: string, endpoint: string, limit: number = 20) {
  return useInfiniteQuery<T[]>({
    queryKey: [key, "infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`${endpoint}?limit=${limit}&skip=${pageParam}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
  });
}
