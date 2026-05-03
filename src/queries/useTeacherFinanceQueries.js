// queries/useTeacherFinanceQueries.js
import { useQuery } from "@tanstack/react-query";
import { getTeacherBalance, getWithdrawalHistory } from "../services/teacherFinanceService";

/**
 * Fetch teacher's current wallet balance and earnings summary.
 */
export const useTeacherBalance = () => {
  return useQuery({
    queryKey: ["teacher-balance"],
    queryFn: getTeacherBalance,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

/**
 * Fetch the history of withdrawal requests made by the teacher.
 */
export const useWithdrawalHistory = () => {
  return useQuery({
    queryKey: ["withdrawal-history"],
    queryFn: getWithdrawalHistory,
  });
};