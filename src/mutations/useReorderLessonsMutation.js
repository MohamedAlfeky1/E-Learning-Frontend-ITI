import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderLessons } from "@/services/lessonsService";
import { toast } from "sonner";

export const useReorderLessonsMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderLessons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
      toast.success("Lessons reordered successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reorder lessons");
    },
  });
};
