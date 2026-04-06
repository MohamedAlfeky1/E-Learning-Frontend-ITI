import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout as logoutService } from "../services/authService";

/**
 * Custom hook to safely log a user out of the application.
 * Removes the auth token from storage, clears the React Query cache,
 * and navigates safely back to the login screen.
 */
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