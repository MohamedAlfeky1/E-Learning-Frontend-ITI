import { getAllVerifications } from '@/services/verificationService';
import { useQuery } from '@tanstack/react-query';

// Example TanStack Query hook for fetching courses
export const useTeacherVerification = () => {
  return useQuery({
    queryKey: ['verifications'],
    queryFn: getAllVerifications,
    // Optional configuration:
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // retry: 1,
  });
};