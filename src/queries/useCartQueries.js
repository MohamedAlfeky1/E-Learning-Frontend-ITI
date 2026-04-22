import { getCart } from '@/services/cartService'
import { useQuery } from '@tanstack/react-query'

/**
 * Fetch a All student cart items using React Query.
 *
 * @function useGetCoursesById
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with course data, loading, and error states.
 */
export const useGetCartItems = () =>{
  return useQuery({
    queryKey:['cart'],
    queryFn:() => getCart(),
  })
}
