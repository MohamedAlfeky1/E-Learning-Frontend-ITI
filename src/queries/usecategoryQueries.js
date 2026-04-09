import { getCategoryById } from "@/services/categoryService"
import { getAllCategory } from "@/services/categoryService"
import { useQuery } from "@tanstack/react-query"

export const useGetGategories = () =>{
  return useQuery({
    queryKey:['allGategories'],
    queryFn:getAllCategory
  })
}

export const useGetGategoryById = (id) =>{
  return useQuery({
    queryKey:['category', id],
    queryFn:() => getCategoryById(id),
    enabled: !!id
  })
}