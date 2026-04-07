import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

/**
 * Fetch a specific course by its unique ID.
 * @param {string} id - The course ID
 */
export const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.COURSES_GET(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

/**
 * Submit or update a course's status.
 * @param {string} id - The course ID
 * @param {Object} statusData - Course status payload
 */
export const postCourseStatus = async (id, statusData) => {
  try {
    const response = await axiosInstance.post(
      ENDPOINTS.COURSES_STATUS(id),
      statusData
    );
    return response.data;
  } catch (error) {
    console.error("Error posting course status:", error);
    throw error;
  }
};
