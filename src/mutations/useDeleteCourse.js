import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "../services/courseService";
import { toast } from "sonner";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      toast.success("Course deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete course");
    },
  });
};
