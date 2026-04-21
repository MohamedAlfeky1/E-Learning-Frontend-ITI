import { removeFromCart } from "@/services/cartService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Course removed from cart successfully");
      console.log(data);
    },
    onError: (error) => {
      toast.error(
        `Failed to remove course from cart: ${error.message || "Unknown error"}`,
      );
      console.log(error);
    },
  });
};
