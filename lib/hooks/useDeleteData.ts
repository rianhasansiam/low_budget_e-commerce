import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteData<T extends { _id?: string }>(key: string, endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    // Optimistic delete - remove from cache immediately
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [key] });

      const previousData = queryClient.getQueryData([key]);

      // Remove from cache optimistically
      queryClient.setQueryData([key], (old: T[] | { data: T[] } | undefined) => {
        if (Array.isArray(old)) {
          return old.filter((item) => item._id !== id);
        }
        if (old && 'data' in old && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.filter((item: T) => item._id !== id),
          };
        }
        return old;
      });

      // Remove individual item from cache
      queryClient.removeQueries({ queryKey: [key, id] });

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([key], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}
