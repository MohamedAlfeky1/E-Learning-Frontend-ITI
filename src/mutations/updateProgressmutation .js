import { enrollmentService } from "@/services/enrollmentService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useUpdateProgressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollmentService.updateProgress,
    onSuccess: (response) => {
      toast.success("Progress Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Error Progress Update , Try Again Later!",
      );
    },
  });
};
