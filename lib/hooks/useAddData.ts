import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddData<T>(key: string, endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: T) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}
