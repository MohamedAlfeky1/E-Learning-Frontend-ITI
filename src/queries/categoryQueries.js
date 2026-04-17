import { getAllCategory, getCategoryById } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch all categories using React Query.
 *
 * @function useCategories
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with categories data, loading, and error states.
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Fetch a category by ID using React Query.
 *
 * @function useGetCategoryById
 * @param {string|number} id - The ID of the category to fetch.
 * @returns {import('@tanstack/react-query').UseQueryResult}
 * React Query result with category data, loading, and error states.
 */
export const useGetCategoryById = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};
