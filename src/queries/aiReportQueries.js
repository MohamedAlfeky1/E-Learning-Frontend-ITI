import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiReportService } from "@/services/aiReportService";
import { toast } from "sonner";

export const useAiReportQuery = (courseId, options = {}) => {
  return useQuery({
    queryKey: ["ai-report", courseId],
    queryFn: () => aiReportService.getReport(courseId),
    enabled: !!courseId,
    retry: false, // Don't retry if report not found
    ...options,
  });
};

export const useGenerateAiReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId) => aiReportService.generateReport(courseId),
    onSuccess: (data, courseId) => {
      toast.success("Report generation started! It may take a minute.");
      // Invalidate the query so it might refetch later, though it's async
      queryClient.invalidateQueries({ queryKey: ["ai-report", courseId] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to generate report";
      toast.error(message);
    },
  });
};
