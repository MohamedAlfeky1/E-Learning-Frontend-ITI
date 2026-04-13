import {  useMutation, useQueryClient } from "@tanstack/react-query";
import {  approveWithdrawal, rejectWithdrawal,updateRevenueConfig, } from "@/services/financeService";
import { toast } from "sonner";



/**
 * Mutation hook to update revenue configuration.
 *
 * @returns {import("@tanstack/react-query").UseMutationResult<
 *  any,
 *  unknown,
 *  number
 * >} Mutation object for updating revenue config.
 *
 * @description
 * - Accepts teacher share as a decimal (e.g. 0.8 instead of 80).
 * - Shows success/error toast messages.
 * - Invalidates related queries after success.
 */
export const useUpdateRevenueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRevenueConfig,

    onSuccess: () => {
      toast.success("Revenue configuration updated!");

      queryClient.invalidateQueries({ queryKey: ["revenueConfig"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update");
    },
  });
};


export const useApproveWithdrawalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveWithdrawal,
    onSuccess: () => {
      toast.success("Withdrawal approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["pendingWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["platformStats"] });
    },
  });
};

export const useRejectWithdrawalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectWithdrawal,
    onSuccess: () => {
      toast.success("Withdrawal rejected and funds returned.");
      queryClient.invalidateQueries({ queryKey: ["pendingWithdrawals"] });
    },
  });
};