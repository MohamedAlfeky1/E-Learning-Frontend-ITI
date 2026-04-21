import { createLesson } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateLessonMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons", courseId]);
      toast.success("Lesson created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create lesson");
    },
  });
};
