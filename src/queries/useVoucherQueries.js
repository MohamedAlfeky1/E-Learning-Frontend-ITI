import { useQuery } from "@tanstack/react-query";
import { voucherService } from "@/services/voucherService";

export const useGetVouchers = () => {
  return useQuery({
    queryKey: ["vouchers"],
    queryFn: voucherService.getAllVouchers,
    staleTime: 5 * 60 * 1000, 
  });
};