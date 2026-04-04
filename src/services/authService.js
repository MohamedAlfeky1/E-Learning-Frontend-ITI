import axios from "axios";

// Get current authenticated user
export const getMe = async () => {
  const response = await axios.get("/api/auth/me");
  return response.data;
};
