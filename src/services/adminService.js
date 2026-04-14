import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";


/**get all platform-wide statistics */
export const getAllStatistics = async()=>{
    try{
        const response = await axiosInstance.get(ENDPOINTS.ADMIN_STATS_OVERVIEW)
        return response.data
    }catch(error){
        console.error("Error Get platform-wide statistics:", error);
        throw error;
    }
}