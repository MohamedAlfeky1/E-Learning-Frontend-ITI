import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '../services/courseService';

// Example TanStack Query hook for fetching courses
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    // Optional configuration:
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // retry: 1,
  });
};
