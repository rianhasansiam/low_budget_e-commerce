
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteData = ({ name, api, optimistic = true, onSuccess }) => {
  const queryClient = useQueryClient();

  // ✅ DELETE Data with error handling and optimistic updates
  const { mutate, mutateAsync, isPending, isLoading, error } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.delete(`${api}/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete data');
      }
    },
    // Optimistic update for instant UI feedback
    onMutate: async (deletedId) => {
      if (!optimistic) return;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [name] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData([name]);
      
      // Optimistically remove the item
      if (previousData && Array.isArray(previousData)) {
        queryClient.setQueryData([name], 
          previousData.filter(item => 
            item._id !== deletedId && item.id !== deletedId
          )
        );
      }
      
      // Return context with the snapshot value
      return { previousData };
    },
    // If the mutation fails, use the context to roll back
    onError: (err, deletedId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([name], context.previousData);
      }
    },
    // ✅ ENHANCED: Call custom onSuccess callback if provided
    onSuccess: (data, variables, context) => {
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    // ✅ ENHANCED: Always refetch after error or success
    onSettled: () => {
      // Invalidate the main query
      queryClient.invalidateQueries({ queryKey: [name] });
      
      // Also invalidate related queries that might depend on this data
      if (name === 'products') {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      } else if (name === 'reviews') {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } else if (name === 'orders') {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    },
  });

  return { 
    deleteData: mutate, 
    deleteDataAsync: mutateAsync,
    isLoading: isPending || isLoading,
    isPending, 
    error 
  };
};