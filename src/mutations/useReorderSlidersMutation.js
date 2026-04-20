import { reorderSliders } from "@/services/slidersService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReorderSlidersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderSliders,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["sliders"]);
      console.log("Sliders reordered successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to reorder sliders:", error);
    },
  });
};
