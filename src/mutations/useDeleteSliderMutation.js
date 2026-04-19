import { deleteSlider } from "@/services/slidersService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteSliderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSlider,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["sliders"]);
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
