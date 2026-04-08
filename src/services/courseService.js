import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

// Find a specific course by its ID
export const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.COURSES_GET(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

// Update/Submit course status (using POST)
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
