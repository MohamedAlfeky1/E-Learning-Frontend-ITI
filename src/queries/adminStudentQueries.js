import { useQuery } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminStudentService";

export const useUsersQuery = (params) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminUsersService.getAllUsers(params),
    keepPreviousData: true,
  });
};

export const useUserDetailQuery = (id) => {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => adminUsersService.getUserById(id),
    enabled: !!id,
  });
};
export const useStudentProfileQuery = (id) => {
  return useQuery({
    queryKey: ["student-profile", id],
    queryFn: () => adminUsersService.getStudentProfile(id),
    enabled: !!id,
  });
};
