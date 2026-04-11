import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRevenueConfig,
  updateRevenueConfig,
  getPlatformStats,
} from "@/services/financeService";
import { toast } from "sonner";

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