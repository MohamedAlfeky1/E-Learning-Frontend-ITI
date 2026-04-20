import { getLessonsByCourse, getLessonById } from "@/services/lessonsService";
import { useQuery } from "@tanstack/react-query";

export const useLessonsByCourse = (courseId) => {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => getLessonsByCourse(courseId),
    enabled: !!courseId,
  });
};

export const useLesson = (courseId, lessonId) => {
  return useQuery({
    queryKey: ["lesson", courseId, lessonId],
    queryFn: () => getLessonById(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
  });
};
