import { addCategory } from "@/services/categoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["categories"]);
      console.log(data);
    },
    onError: (error) => {
      console.log("Failed to add category: ", error);
    },
  });
};
