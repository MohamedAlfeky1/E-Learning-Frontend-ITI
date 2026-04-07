// queries/usePaymentQueries.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

export const usePaymentHistory = () => {
    return useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
        const response = await axiosInstance.get("/payments/history");
        return response.data.data;  
    },
    });
};