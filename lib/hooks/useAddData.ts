import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  insertedId?: string;
  message?: string;
}

export function useAddData<T extends { _id?: string }>(key: string, endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: T): Promise<ApiResponse<T>> => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add");
      return res.json();
    },
    // Optimistic update - add to cache immediately
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [key] });

      // Snapshot current cache
      const previousData = queryClient.getQueryData([key]);

      // Optimistically add to cache
      queryClient.setQueryData([key], (old: T[] | { data: T[] } | undefined) => {
        const tempItem = { ...newData, _id: `temp-${Date.now()}` };
        if (Array.isArray(old)) {
          return [tempItem, ...old];
        }
        if (old && 'data' in old && Array.isArray(old.data)) {
          return { ...old, data: [tempItem, ...old.data] };
        }
        return old;
      });

      return { previousData };
    },
    // Rollback on error
    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([key], context.previousData);
      }
    },
    // Refetch after success to get server data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}
