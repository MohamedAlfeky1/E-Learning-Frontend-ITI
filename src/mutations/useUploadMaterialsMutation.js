import { uploadLessonMaterials } from "@/services/lessonsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadMaterialsMutation = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadLessonMaterials,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons", courseId]);
      toast.success("Materials uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload materials");
    },
  });
};
