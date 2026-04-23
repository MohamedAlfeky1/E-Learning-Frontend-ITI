import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourse } from '../services/courseService';

/**
 * Hook for updating an existing course.
 * On success, invalidates the 'courses' query to automatically re-fetch the updated list.
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, courseData }) => updateCourse(id, courseData),
    onSuccess: (data) => {
      // Invalidate and refetch whenever a course is successfully updated
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', data._id] }); // Assuming course ID
      console.log('Course updated successfully!', data);
    },
    onError: (error) => {
      console.error('Failed to update course:', error);
    }
  });
};