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
  const response = await axiosInstance.post(
    ENDPOINTS.COURSES_CREATE,
    courseData,
  );
  return response.data;
};

/**
 * Update an existing course.
 * @param {string} id - The course ID
 * @param {FormData} courseData - Updated course payload (supports file uploads)
 */
export const updateCourse = async (id, courseData) => {
  const response = await axiosInstance.patch(
    ENDPOINTS.COURSES_UPDATE(id),
    courseData,
  );
  return response.data;
};

/**
 * Fetch a specific course by its unique ID.
 * @param {string} id - The course ID
 */
export const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.COURSES_GET(id));
    return response?.data;
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
      statusData,
    );
    return response.data;
  } catch (error) {
    console.error("Error posting course status:", error);
    throw error;
  }
};

export const publishCourse = async (id) => {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.COURSES_PUBLISH(id));
    return response.data;
  } catch (error) {
    console.error("Error publishing course:", error);
    throw error.response.data;
  }
};

//list all courses (using GET)
export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.COURSES_LIST);
    return response.data;
  } catch (error) {
    console.error("Error get all courses data:", error);
    throw error;
  }
};

//browse & search courses
export const browseCourses = async (data) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.COURSES_SEARCH, data);
    console.log("Browse courses response:", response);

    return response.data;
  } catch (error) {
    console.error("Error browse courses :", error);
    throw error;
  }
};

// Fetch all courses belonging to the currently logged-in teacher.
// Returns an empty-data structure instead of throwing when the
// backend responds with 404 (no courses exist yet).
export const getAllCoursesOfLoggedInTeacher = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.COURSES_MY);
    return response.data;
  } catch (error) {
    // Backend returns 404 when the teacher has no courses yet.
    // Treat this as "no data" rather than a real error.
    if (error?.response?.status === 404) {
      return { data: [], message: "No courses found" };
    }
    console.error("Error fetching teacher courses:", error);
    throw error;
  }
};

/**
 * Delete a course by its ID.
 * @param {string} id - The course ID
 */
export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.COURSES_UPDATE(id));
  return response.data;
};
