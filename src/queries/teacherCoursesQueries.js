import { useQuery } from '@tanstack/react-query';
import { getMyCourses } from '@/services/profileService';

// Example TanStack Query hook for fetching courses
export const useTeacherCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getMyCourses,
    // Optional configuration:
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // retry: 1,
  });
};