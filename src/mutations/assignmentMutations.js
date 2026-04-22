import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  gradeSubmission,
  submitAssignment,
} from "@/services/assignmentService";

/** Create a new assignment */
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }) => createAssignment(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", variables.courseId],
      });
      toast.success("Assignment created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create assignment"
      );
    },
  });
};

/** Update an assignment */
export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update assignment"
      );
    },
  });
};

/** Delete an assignment */
export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete assignment"
      );
    },
  });
};

/** Grade a student's submission */
export const useGradeSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, sid, data }) =>
      gradeSubmission(assignmentId, sid, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["submissions", variables.assignmentId],
      });
      toast.success("Submission graded successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to grade submission"
      );
    },
  });
};

/** Student submits an assignment */
export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, data }) =>
      submitAssignment(assignmentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mySubmission", variables.assignmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["myCourseGrades"] });
      toast.success("Assignment submitted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to submit assignment"
      );
    },
  });
};
