import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "../services/courseService";
import { toast } from "sonner";

/**
 * Hook for updating an existing course.
 * On success, invalidates the 'courses' query to automatically re-fetch the updated list.
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, courseData }) => updateCourse(id, courseData),
    onSuccess: (data) => {
      // Invalidate and refetch whenever a course is successfully updated
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", data._id] }); // Assuming course ID
      toast.success("Course updated successfully!");
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update course!");
    },
  });
};
