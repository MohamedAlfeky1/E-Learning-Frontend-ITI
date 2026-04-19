import { addFavorite } from "@/services/favoritesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Course added to favorites successfully");
      console.log(data);
    },
    onError: (error) => {
      toast.error("Failed to add course to favorites");
      console.log(error);
    },
  });
};
