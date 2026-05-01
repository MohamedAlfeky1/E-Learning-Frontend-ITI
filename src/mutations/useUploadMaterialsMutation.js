import { uploadLessonMaterials } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadMaterialsMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLessonMaterials,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["lessons", courseId]);
      queryClient.invalidateQueries(["lesson", courseId, variables.lessonId]);
      toast.success("Materials uploaded successfully");
    },
    onError: (error) => {
      if (error.message === "canceled") {
        toast.info("Canceled");
      } else {
        toast.error(error.message || "Failed to upload materials");
      }
    },
  });
};
