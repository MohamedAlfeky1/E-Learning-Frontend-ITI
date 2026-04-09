import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollmentService";

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
 * Fetches enrollment details for a specific course.
 *
 * @function
 * @param {string | number} courseId - The ID of the course for which to fetch enrollment details.
 * @returns {import('@tanstack/react-query').UseQueryResult} 
 *  React Query result object containing enrollment details, loading, and error states.
 */
export const useEnrollmentDetailsQuery = (courseId) => {
  return useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: () => enrollmentService.getEnrollmentByCourseId(courseId),
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
      queryClient.invalidateQueries(["my-courses"]);
      queryClient.invalidateQueries(["enrollment"]);
    }
  });
};