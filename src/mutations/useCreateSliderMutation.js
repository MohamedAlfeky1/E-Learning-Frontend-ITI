import { addSlider } from "@/services/slidersService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateSliderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSlider,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["sliders"]);
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
