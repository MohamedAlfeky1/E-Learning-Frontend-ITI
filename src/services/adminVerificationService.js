import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getAllVerifications = async () => {
    try {
        const response = await axiosInstance.get(ENDPOINTS.ADMIN_VERIFICATIONS_LIST);
        return response.data
    } catch (error) {
        console.error("Error fetching verifications:", error);
        throw error;
    }
}

export const verificationDecision = async ({teacherId,adminDecision, adminNote, decidedAt}) => {
    try {
        const response = await axiosInstance.post(ENDPOINTS.ADMIN_VERIFICATIONS_PROCESS(teacherId),{
            adminDecision, adminNote, decidedAt, 
        });
        return response.data

    }catch (error) {
        console.error("Error processing verification decision:", error);
        throw error;
    }
}