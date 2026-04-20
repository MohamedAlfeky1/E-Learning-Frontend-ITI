import { uploadLessonVideos } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadVideosMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLessonVideos,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons", courseId]);
      toast.success("Videos uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload videos");
    },
  });
};
