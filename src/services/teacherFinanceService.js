import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

export const getTeacherBalance = async () => {
    const response = await axiosInstance.get(ENDPOINTS.TEACHER_EARNINGS);
     console.log("RAW BALANCE RESPONSE:", response.data); 
    return response.data.data;
};

export const getWithdrawalHistory = async () => {
    const response = await axiosInstance.get(ENDPOINTS.TEACHER_WITHDRAWALS_LIST);
    return response.data.data;
};

export const requestWithdrawal = async (withdrawalData) => {
    // withdrawalData: { amount, method, accountInfo }
    const response = await axiosInstance.post(ENDPOINTS.TEACHER_WITHDRAWALS_CREATE, withdrawalData);
    return response.data.data;
};