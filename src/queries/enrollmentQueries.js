import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollmentService";

export const useMyCoursesQuery = () => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: enrollmentService.getMyCourses,
  });
};

// كويري جديد عشان لما تدخلي جوه كورس معين
export const useEnrollmentDetailsQuery = (courseId) => {
  return useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: () => enrollmentService.getEnrollmentByCourseId(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateProgressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, videoId }) => 
      enrollmentService.updateProgress(enrollmentId, videoId),
    onSuccess: () => {
      // تحديث الكاش للكورسات وللكورس الحالي
      queryClient.invalidateQueries(["my-courses"]);
      queryClient.invalidateQueries(["enrollment"]);
    }
  });
};