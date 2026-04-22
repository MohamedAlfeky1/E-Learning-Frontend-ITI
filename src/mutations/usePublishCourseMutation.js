import { publishCourse } from "@/services/courseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePublishCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["teacher-courses"]);
      toast.success("Course published successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish course");
    },
  });
};
