import { removeFavorite } from "@/services/favoritesService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Course removed from favorites successfully");
      console.log(data);
    },
    onError: (error) => {
      toast.error("Failed to remove course from favorites");
      console.log(error);
    },
  });
};
