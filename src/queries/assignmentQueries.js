import { useQuery } from "@tanstack/react-query";
import {
  getAssignments,
  getSubmissions,
  getMySubmission,
  getMyCourseGrades,
} from "@/services/assignmentService";

/** Fetch all assignments for a course (teacher or student) */
export const useAssignments = (courseId) => {
  return useQuery({
    queryKey: ["assignments", courseId],
    queryFn: () => getAssignments(courseId),
    enabled: !!courseId,
  });
};

/** Fetch all submissions for an assignment (teacher) */
export const useSubmissions = (assignmentId) => {
  return useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: () => getSubmissions(assignmentId),
    enabled: !!assignmentId,
  });
};

/** Fetch student's own submission for an assignment */
export const useMySubmission = (assignmentId) => {
  return useQuery({
    queryKey: ["mySubmission", assignmentId],
    queryFn: () => getMySubmission(assignmentId),
    enabled: !!assignmentId,
    retry: false, // 404 is expected when there's no submission
  });
};

/** Fetch student's grades for all assignments in a course */
export const useMyCourseGrades = (courseId) => {
  return useQuery({
    queryKey: ["myCourseGrades", courseId],
    queryFn: () => getMyCourseGrades(courseId),
    enabled: !!courseId,
  });
};
