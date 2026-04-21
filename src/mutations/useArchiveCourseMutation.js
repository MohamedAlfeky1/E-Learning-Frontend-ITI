import { archiveCourse } from "@/services/courseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useArchiveCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["teacher-courses"]);
      toast.success("Course archived successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to archive course");
    },
  });
};
