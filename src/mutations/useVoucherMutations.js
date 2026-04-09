import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voucherService } from "@/services/voucherService";
import { toast } from "sonner";

export const useVoucherMutations = () => {
  const queryClient = useQueryClient();

  const createVoucher = useMutation({
    mutationFn: voucherService.createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher created successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create voucher");
    }
  });

  const deleteVoucher = useMutation({
    mutationFn: voucherService.deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher deleted!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete voucher");
    }
  });

  const updateVoucher = useMutation({
    mutationFn: voucherService.updateVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher updated successfully!");
    }
  });

  return {
    createVoucher,
    deleteVoucher,
    updateVoucher
  };
};