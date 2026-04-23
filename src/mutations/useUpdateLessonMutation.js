import { updateLesson } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateLessonMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLesson,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons", courseId]);
      toast.success("Lesson updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update lesson");
    },
  });
};
