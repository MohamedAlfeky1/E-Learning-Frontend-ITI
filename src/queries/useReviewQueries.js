import { getAllCategory } from "@/services/categoryService"
import { getCourseReviews } from "@/services/reviewService"
import { useQuery } from "@tanstack/react-query"


/**
 * Fetch reviews for a specific course using React Query.
 *
 * @function useGetCourseReview
 * @param {string} courseId - Course ID
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with reviews data, loading, and error states.
 */
export const useGetCourseReview = (courseId) => {
  return useQuery({
    queryKey: ['courseReviews', courseId],
    queryFn: () => getCourseReviews(courseId),
    enabled: !!courseId,
  })
}