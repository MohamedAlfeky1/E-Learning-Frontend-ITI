import { deleteCategory } from "@/services/categoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["categories"]);
      console.log(data);
    },
    onError: (error) => {
      console.log("Failed to delete category: ", error);
    },
  });
};
