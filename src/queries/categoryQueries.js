import { getAllCategory } from "@/services/categoryService"
import { useQuery } from "@tanstack/react-query"

export const useGetGategories = () =>{
  return useQuery({
    queryKey:['allGategories'],
    queryFn:getAllCategory
  })
}