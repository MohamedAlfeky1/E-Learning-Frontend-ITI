import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/authService";

export const useUserQuery = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: !!token, 
    retry: false,   
  });
};