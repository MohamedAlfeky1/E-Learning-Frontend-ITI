import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voucherService } from "@/services/voucherService";
import { toast } from "sonner";
/**
 * Custom hook to manage voucher-related mutations.
 * Handles creating, updating, and deleting vouchers with automatic cache invalidation.
 * * @returns {Object} An object containing the mutation states and functions:
 * @returns {import("@tanstack/react-query").UseMutationResult} createVoucher - Mutation for creating a new voucher.
 * @returns {import("@tanstack/react-query").UseMutationResult} deleteVoucher - Mutation for removing a voucher by ID.
 * @returns {import("@tanstack/react-query").UseMutationResult} updateVoucher - Mutation for updating existing voucher data.
 */

export const useVoucherMutations = () => {
  const queryClient = useQueryClient();

  const createVoucher = useMutation({
    mutationFn: voucherService.createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher Created Successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create voucher");
    },
  });

  const deleteVoucher = useMutation({
    mutationFn: voucherService.deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher Deleted Successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete voucher");
    },
  });

  const updateVoucher = useMutation({
    mutationFn: voucherService.updateVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    },
  });

  const applyVoucher = useMutation({
    mutationFn: voucherService.applyVoucher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher Applied Successfully!");
      return data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to apply voucher");
    },
  });
  const previewVoucher = useMutation({
  mutationFn: voucherService.previewVoucher,
  onError: (error) => {
    toast.error(error?.response?.data?.message || "Failed to preview voucher");
  },
});

  return {
    createVoucher,
    deleteVoucher,
    updateVoucher,
    applyVoucher,
    previewVoucher,
  };
};
