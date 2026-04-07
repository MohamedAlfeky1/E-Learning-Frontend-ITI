// mutations/useTeacherFinanceMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestWithdrawal } from "../services/teacherFinanceService";
import { toast } from "sonner";

/**
 * Handle new withdrawal requests and refresh financial data upon success.
 */
export const useWithdrawMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      toast.success("Withdrawal request submitted!");
      queryClient.invalidateQueries({ queryKey: ["teacher-balance"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawal-history"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Withdrawal failed");
    }
  });
};