import { addToCart } from "@/services/cartService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({courseId}) => addToCart(courseId),
    onSuccess: (data) => {
      // Invalidate and refetch whenever a new course is successfully added
      // This causes the useGetCartItems query to automatically re-fetch
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log('Course Added successfully!', data);
    },
    onError: (error) => {
      toast.error('Failed to Add course')
      console.error('Failed to Add course:', error);
    }
  });
};
