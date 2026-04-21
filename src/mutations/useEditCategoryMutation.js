import { updateCategory } from "@/services/categoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["categories"]);
      console.log(data);
    },
    onError: (error) => {
      console.log("Failed to update category: ", error);
    },
  });
};
