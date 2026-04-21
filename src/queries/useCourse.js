import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '../services/courseService';

/**
 * Hook for fetching a single course by ID.
 */
export const useCourse = (id) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: !!id, // Only run if id is provided
  });
};