
import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
/*
 * Service for handling course enrollments and progress updates.
 * @namespace enrollmentService
 */

export const enrollmentService = {
  getMyCourses: async () => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.ENROLLMENTS_MY);
      return data.data;
    } catch (error) {
      console.error("Error Get Enrollments:", error);
      throw error;
    }

  },

  getTeacherCourses: async () => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.COURSES_MY);
      return data.data;
    } catch (error) {
      console.error("Error Get Teacher Enrollments:", error);
      throw error;
    }

  },

  getEnrollmentByCourseId: async (courseId) => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.ENROLLMENTS_GET(courseId));
      return data?.data;
    } catch (error) {
      console.error("Error Get Enrollments By Id:", error);
      throw error;
    }
  },

   getTeacherEnrollmentByCourseId: async (courseId) => {
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.ENROLLMENT_TEACHER_GET(courseId));
      return data.data;
    } catch (error) {
      console.error("Error Get Enrollments By Id:", error);
      throw error;
    }
  },

  updateProgress: async (enrollmentId, videoId) => {
    try {
      const { data } = await axiosInstance.patch(
        ENDPOINTS.ENROLLMENTS_UPDATE_PROGRESS(enrollmentId),
        { videoId }
      );
      return data;
    } catch (error) {
      console.error("Error Update Progress:", error);
      throw error;
    }
  }
};

/*
 * Get All Courses That all student enroll
 * 
 */
export const getAllCoursesOfUser = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ENROLLMENTS_MY)
    return response.data;
  } catch (error) {
    console.error("Error get lesson data:", error);
    throw error;
  }
}