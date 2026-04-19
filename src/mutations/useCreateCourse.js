import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "../services/courseService";
import { toast } from "sonner";

/**
 * Hook for creating a new course.
 * On success, invalidates the 'courses' query to automatically re-fetch the updated list.
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create course!");
    },
  });
};
