import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "../services/courseService";
import { toast } from "sonner";

// Example TanStack Mutation hook for creating a course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      toast.success("Course created successfully!");
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create course!");
    },
  });
};
