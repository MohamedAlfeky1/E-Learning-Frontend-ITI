import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

export const getRevenueConfig = () =>
    axiosInstance.get(ENDPOINTS.ADMIN_REVENUE_CONFIG_GET);

export const updateRevenueConfig = (teacherShare) =>
    axiosInstance.patch(ENDPOINTS.ADMIN_REVENUE_CONFIG_UPDATE, { teacherShare });

export const getPlatformStats = () =>
    axiosInstance.get(ENDPOINTS.ADMIN_PLATFORM_STATS);

export const getAllPendingWithdrawals = () => 
    axiosInstance.get("/finance/admin/withdrawals/pending");

export const approveWithdrawal = (requestId) => 
    axiosInstance.patch(`/finance/admin/withdrawals/${requestId}/approve`);

export const rejectWithdrawal = ({ requestId, adminNote }) => 
    axiosInstance.patch(`/finance/admin/withdrawals/${requestId}/reject`, { adminNote });