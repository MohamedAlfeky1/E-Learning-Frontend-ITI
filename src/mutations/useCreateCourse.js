import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse } from '../services/courseService';

/**
 * Hook for creating a new course.
 * On success, invalidates the 'courses' query to automatically re-fetch the updated list.
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCourse) => createCourse(newCourse),
    onSuccess: (data) => {
      // Invalidate and refetch whenever a new course is successfully created
      // This causes the useCourses query to automatically re-fetch
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      console.log('Course created successfully!', data);
    },
    onError: (error) => {
      console.error('Failed to create course:', error);
    }
  });
};
