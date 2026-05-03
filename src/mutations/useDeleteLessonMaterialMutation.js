import { deleteLessonMaterial } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteLessonMaterialMutation = (courseId, lessonId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLessonMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons", courseId]);
      queryClient.invalidateQueries(["lesson", courseId, lessonId]);
       queryClient.invalidateQueries(["my-courses"]);
      queryClient.invalidateQueries(["courses"]);
      toast.success("Material deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete material");
    },
  });
};
