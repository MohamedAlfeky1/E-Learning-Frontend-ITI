import { deleteLesson } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteLessonMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons", courseId]);
      toast.success("Lesson deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete lesson");
    },
  });
};
