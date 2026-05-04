import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollmentService";
import { toast } from "sonner";

/**
 * Fetches the list of courses the current user is enrolled in.
 *
 * @function
 * @returns {import('@tanstack/react-query').UseQueryResult} 
 *  React Query result object containing courses data, loading, and error states.
 */
export const useMyCoursesQuery = () => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: enrollmentService.getMyCourses,
  });
};

/**
 * Fetches the list of courses the current user is enrolled in  returns enrolled course IDs as a Set.
 *
 * @function
 * @returns {import('@tanstack/react-query').UseQueryResult} 
 *  React Query result object containing courses IDs, loading, and error states.
 */
export const useMyEnrolledCourseIds = (options = {}) => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: enrollmentService.getMyCourses,
    select: (data) => new Set(data?.map((e) => e.courseId?._id ?? e.courseId) ?? []),
    ...options,
  });
};
/**
 * Fetches the list of courses the current user is enrolled in.
 *
 * @function
 * @returns {import('@tanstack/react-query').UseQueryResult} 
 *  React Query result object containing courses data, loading, and error states.
 */
export const useTeacherCoursesQuery = () => {
  return useQuery({
    queryKey: ["my-enrollments"],
    queryFn: enrollmentService.getTeacherCourses,
  });
};
/**
 * Fetches enrollment details for a specific course.
 *
 * @function
 * @param {string | number} courseId - The ID of the course for which to fetch enrollment details.
 * @returns {import('@tanstack/react-query').UseQueryResult} 
 *  React Query result object containing enrollment details, loading, and error states.
 */
export const useEnrollmentDetailsQuery = (courseId, options = {}) => {
  return useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: () => enrollmentService.getEnrollmentByCourseId(courseId),
    enabled: !!courseId,
    ...options,
  });
};
/**
 * Fetches enrollment details for a specific course for teacher courses.
 *
 * @function
 * @param {string | number} courseId - The ID of the course for which to fetch enrollment details.
 * @returns {import('@tanstack/react-query').UseQueryResult} 
 *  React Query result object containing enrollment details, loading, and error states.
 */
export const useTeacherEnrollmentDetailsQuery = (courseId) => {
  return useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: () => enrollmentService.getTeacherEnrollmentByCourseId(courseId),
    enabled: !!courseId,
  });
};
  
/**
 * Returns a mutation hook to update the progress of a video within a course enrollment.
 *
 * @function
 * @returns {import('@tanstack/react-query').UseMutationResult} 
 *  React Query mutation object containing mutate function, status, and error info.
 */
export const useUpdateProgressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, videoId }) =>
      enrollmentService.updateProgress(enrollmentId, videoId),
    onSuccess: () => {
      toast.success("Progress Updated Successfully");
      queryClient.invalidateQueries(["my-courses"]);
      queryClient.invalidateQueries(["courses"]);

      queryClient.invalidateQueries(["enrollment"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating progress");
    },
  });
};