import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
/**
 * Custom hook to fetch the user's payment transaction history.
 * Caches data for 5 minutes to optimize performance and reduce API calls.
 */

export const usePaymentHistory = () => {
    return useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
        const response = await axiosInstance.get("/payments/history");
        return response.data.data;  
    },
    staleTime: 0

    });
};