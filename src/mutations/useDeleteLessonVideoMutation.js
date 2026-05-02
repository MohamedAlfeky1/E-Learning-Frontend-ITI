import { deleteLessonVideo } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteLessonVideoMutation = (courseId, lessonId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLessonVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons", courseId]);
      queryClient.invalidateQueries(["lesson", courseId, lessonId]);
       queryClient.invalidateQueries(["my-courses"]);
      queryClient.invalidateQueries(["courses"]);
      toast.success("Video deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete video");
    },
  });
};
