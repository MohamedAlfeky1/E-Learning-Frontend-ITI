import { uploadLessonVideos } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadVideosMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLessonVideos,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["lessons", courseId]);
      queryClient.invalidateQueries(["lesson", courseId, variables.lessonId]);
       queryClient.invalidateQueries(["my-courses"]);
      queryClient.invalidateQueries(["courses"]);
       queryClient.invalidateQueries(["enrollment"]); 
      toast.success("Videos uploaded successfully");
    },
    onError: (error) => {
      if (error.message === "canceled") {
        toast.info("Canceled");
      } else {
        toast.error(error.message || "Failed to upload videos");
      }
    },
  });
};
