import { enrollmentService } from "@/services/enrollmentService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


/**
 * Updates a student's progress in a specific course.
 * On success, displays a toast notification and invalidates the "my-courses" query cache
 * to ensure progress data is updated on the frontend.
 */
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
