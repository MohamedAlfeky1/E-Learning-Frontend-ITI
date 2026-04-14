import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/adminTeacherService";

export const useTeachersQuery = (params) => {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => adminService.getAllTeachers(params),
    
    staleTime: 5 * 60 * 1000, 
  });
};