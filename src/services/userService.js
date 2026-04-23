import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";


export const getUserById = async (userId) => {
    console.log("Fetching URL:", ENDPOINTS.USER_GET_BY_ID(userId)); 
    try {
        const response = await axiosInstance.get(ENDPOINTS.USER_GET_BY_ID(userId))
        return response.data;
    } catch (error) {
        console.error("Error get user data by id:", error);
        throw error;
    }

}