import { updateSlider } from "@/services/slidersService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateSliderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSlider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sliders"]);
    },
    onError: (error) => {
      console.error("Failed to update slider:", error);
    },
  });
};
