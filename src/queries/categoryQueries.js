import { getAllCategory } from "@/services/categoryService"
import { useQuery } from "@tanstack/react-query"

/**
 * Fetch all categories using React Query.
 *
 * @function useGetGategories
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with categories data, loading, and error states.
 */
export const useGetGategories = () =>{
  return useQuery({
    queryKey:['allGategories'],
    queryFn:getAllCategory
  })
}