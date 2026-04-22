import { useQuery } from '@tanstack/react-query';
import { getAllCoursesOfLoggedInTeacher } from '@/services/courseService';

/**
 * Fetch all courses belonging to the currently logged-in teacher.
 * Calls GET /courses/my-courses
 * Treats 404 (no courses) as an empty result rather than an error.
 */
export const useTeacherCourses = () => {
  return useQuery({
    queryKey: ['teacher-courses'],
    queryFn: getAllCoursesOfLoggedInTeacher,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Don't retry network calls that return 404 — that just means no courses yet
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
};