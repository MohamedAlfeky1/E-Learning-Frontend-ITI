import { useQuery } from "@tanstack/react-query";
import { getAllPendingWithdrawals,  getRevenueConfig,
  getPlatformStats, } from "@/services/financeService";


/**
 * Fetches the revenue configuration for the platform.
 *
 * @returns {import("@tanstack/react-query").UseQueryResult<{
 *  teacherShare: number
 * }>} React Query result containing revenue config data.
 */
export const useRevenueConfigQuery = () => {
  return useQuery({
    queryKey: ["revenueConfig"],
    queryFn: getRevenueConfig,
    select: (res) => res.data.data,
  });
};

/**
 * Fetches platform financial statistics.
 *
 * @returns {import("@tanstack/react-query").UseQueryResult<{
 *  totalPlatformRevenue: number,
 *  totalPaidToTeachers: number,
 *  totalPendingToTeachers: number
 * }>} React Query result containing platform stats.
 */
export const usePlatformStatsQuery = () => {
  return useQuery({
    queryKey: ["platformStats"],
    queryFn: getPlatformStats,
    select: (res) => res.data.data,
  });
};
export const usePendingWithdrawalsQuery = () => {
  return useQuery({
    queryKey: ["pendingWithdrawals"],
    queryFn: getAllPendingWithdrawals,
    select: (res) => res.data.data,
  });
};