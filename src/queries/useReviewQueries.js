import { getAllCategory } from "@/services/categoryService"
import { getCourseReviews } from "@/services/reviewService"
import { useQuery } from "@tanstack/react-query"

export const useGetCourseReview = (courseId) => {
  return useQuery({
    queryKey: ['courseReviews', courseId],
    queryFn: () => getCourseReviews(courseId),
    enabled: !!courseId,
  })
}