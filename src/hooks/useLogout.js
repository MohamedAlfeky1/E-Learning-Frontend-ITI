import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout as logoutService } from "../services/authService";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logoutService(); 
    queryClient.clear(); 
    navigate("/login", { replace: true }); 
  };

  return handleLogout;
};