import { useQuery } from "@tanstack/react-query";
import { getMe, getTeachers, getStudents } from "../services/authService";

export const useUserQuery = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: !!token, 
    retry: false,   
  });
};

export const useTeachersQuery = () => {
  return useQuery({
    queryKey: ["auth", "teachers"],
    queryFn: getTeachers,
  });
};

export const useStudentsQuery = () => {
  return useQuery({
    queryKey: ["auth", "students"],
    queryFn: getStudents,
  });
};
