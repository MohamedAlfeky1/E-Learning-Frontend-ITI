import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

/**
 * Fetch all available categories.
 */
export const fetchCategories = async () => {
  const response = await axiosInstance.get(ENDPOINTS.CATEGORIES_LIST);
  return response.data;
};

/**
 * Create a new course.
 * @param {FormData} courseData - Course payload (supports file uploads)
 */
export const createCourse = async (courseData) => {
  const response = await axiosInstance.post(ENDPOINTS.COURSES_CREATE, courseData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Update an existing course.
 * @param {string} id - The course ID
 * @param {FormData} courseData - Updated course payload (supports file uploads)
 */
export const updateCourse = async (id, courseData) => {
  const response = await axiosInstance.put(ENDPOINTS.COURSES_UPDATE(id), courseData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

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
