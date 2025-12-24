
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddData = ({ name, api, optimistic = true, onSuccess }) => {
  const queryClient = useQueryClient();

  // ✅ POST Data with error handling and optimistic updates
  const { mutateAsync, isPending, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axios.post(api, data);
        return response.data;
      } catch (error) {
        console.error('API Error details:', error.response?.data);
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to add data');
      }
    },
    // Optimistic update for instant UI feedback
    onMutate: async (newData) => {
      if (!optimistic) return;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [name] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData([name]);
      
      // Optimistically update to the new value
      if (previousData && Array.isArray(previousData)) {
        const optimisticItem = {
          ...newData,
          _id: 'temp-' + Date.now(), // Temporary ID
          id: 'temp-' + Date.now(),
          createdAt: new Date().toISOString(),
        };
        
        queryClient.setQueryData([name], [...previousData, optimisticItem]);
      }
      
      // Return context with the snapshot value
      return { previousData };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newData, context) => {
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
    // ✅ ENHANCED: Always refetch after error or success to ensure consistency
    onSettled: () => {
      // Invalidate the main query
      queryClient.invalidateQueries({ queryKey: [name] });
      
      // Also invalidate related queries that might depend on this data
      // For example, if adding a product, also invalidate category stats, etc.
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
    addData: mutateAsync, 
    isLoading: isPending || isLoading, 
    isPending,
    error 
  };
};
