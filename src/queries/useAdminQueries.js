
import { getAllStatistics } from '@/services/adminService';
import { useQuery } from '@tanstack/react-query';
/**
 * Fetch all platform-wide statistics using React Query.
 *
 * @function useGetPlatformStatistics
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with data, loading, and error states.
 */


export const useGetPlatformStatistics = () => {
  return useQuery({
    queryKey: ['platformStatistics'],
    queryFn: getAllStatistics,
  });
};