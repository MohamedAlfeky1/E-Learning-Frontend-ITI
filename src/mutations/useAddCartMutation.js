import { addToCart } from "@/services/cartService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Course added to cart successfully");
      console.log(data);
    },
    onError: (error) => {
      toast.error("Failed to add course to cart");
      console.log(error);
    },
  });
};
