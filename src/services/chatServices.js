import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getConversations = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CONVERSATIONS);
    return response.data;
  } catch (error) {
    console.error("Error get Conversations :", error);
    throw error;
  }
};
