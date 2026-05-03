import { getUserById } from "@/services/userService"
import { useQuery } from "@tanstack/react-query"


/**
 * Get All User Data By ID using React Query.
 *
 * @function useGetUser
 * @param {string} courseId - user ID
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with reviews data, loading, and error states.
 */
export const useGetUser = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })
}