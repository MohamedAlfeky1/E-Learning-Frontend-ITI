import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

export const enrollmentService = {
  getMyCourses: async () => {
    const { data } = await axiosInstance.get(ENDPOINTS.ENROLLMENTS_MY);
    return data.data; 
  },

  getEnrollmentByCourseId: async (courseId) => {
    const { data } = await axiosInstance.get(ENDPOINTS.ENROLLMENTS_GET(courseId));
    return data.data;
  },

 updateProgress: async (enrollmentId, videoId) => {
  const { data } = await axiosInstance.patch(
    ENDPOINTS.ENROLLMENTS_UPDATE_PROGRESS(enrollmentId), 
    { videoId }
  );
  return data.data;
}
};