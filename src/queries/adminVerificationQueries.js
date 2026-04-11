import { getAllVerifications } from '@/services/verificationService';
import { useQuery } from '@tanstack/react-query';

/**
 * Fetch all teacher verification requests using React Query.
 *
 * @function useTeacherVerification
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with data, loading, and error states.
 */

export const useTeacherVerification = () => {
  return useQuery({
    queryKey: ['verifications'],
    queryFn: getAllVerifications,
    // Optional configuration:
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // retry: 1,
  });
};