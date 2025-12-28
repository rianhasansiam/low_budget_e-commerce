import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateData<T extends { _id?: string }>(key: string, endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    // Optimistic update - update cache immediately
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [key] });
      await queryClient.cancelQueries({ queryKey: [key, id] });

      const previousData = queryClient.getQueryData([key]);
      const previousItem = queryClient.getQueryData([key, id]);

      // Update list cache
      queryClient.setQueryData([key], (old: T[] | { data: T[] } | undefined) => {
        if (Array.isArray(old)) {
          return old.map((item) =>
            item._id === id ? { ...item, ...data } : item
          );
        }
        if (old && 'data' in old && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((item: T) =>
              item._id === id ? { ...item, ...data } : item
            ),
          };
        }
        return old;
      });

      // Update individual item cache
      queryClient.setQueryData([key, id], (old: T | { data: T } | undefined) => {
        if (old && 'data' in old) {
          return { ...old, data: { ...old.data, ...data } };
        }
        return old ? { ...old, ...data } : old;
      });

      return { previousData, previousItem };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([key], context.previousData);
      }
      if (context?.previousItem) {
        queryClient.setQueryData([key, id], context.previousItem);
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.invalidateQueries({ queryKey: [key, id] });
    },
  });
}
