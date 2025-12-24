
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateData = ({ name, api, optimistic = true, onSuccess }) => {
  const queryClient = useQueryClient();

  // ✅ UPDATE Data with error handling and optimistic updates
  const { mutate, mutateAsync, isPending, isLoading, error } = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const response = await axios.put(`${api}/${id}`, data);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update data');
      }
    },
    // Optimistic update for instant UI feedback
    onMutate: async ({ id, data }) => {
      if (!optimistic) return;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [name] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData([name]);
      
      // Optimistically update to the new value
      if (previousData && Array.isArray(previousData)) {
        queryClient.setQueryData([name], 
          previousData.map(item => 
            item._id === id || item.id === id 
              ? { ...item, ...data, updatedAt: new Date().toISOString() } 
              : item
          )
        );
      }
      
      // Return context with the snapshot value
      return { previousData };
    },
    // If the mutation fails, use the context to roll back
    onError: (err, variables, context) => {
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
    updateData: mutate, 
    updateDataAsync: mutateAsync,
    isLoading: isPending || isLoading,
    isPending, 
    error 
  };
};
