import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
/**
 * Service for handling course enrollments and progress updates.
 * @namespace enrollmentService
 */

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
  return data;
}
};

/**
 * Get All Courses That all student enroll
 * 
 */ 
export const getAllCoursesOfUser = async ()=>{
  try {
    const response = await axiosInstance.get(ENDPOINTS.ENROLLMENTS_MY)
    return response.data;
  } catch(error) {
    console.error("Error get lesson data:", error);
    throw error;
  }
}
