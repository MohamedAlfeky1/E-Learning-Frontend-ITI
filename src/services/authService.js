import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

// Get current authenticated user
export const getMe = async () => {
  const response = await axiosInstance.get(ENDPOINTS.PROFILE_GET);
  return response.data;
};
