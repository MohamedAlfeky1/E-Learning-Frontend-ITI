import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getAllVerifications = async ()=>{
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_VERIFICATIONS_LIST);
    return response.data
}