import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints"



/**
 * Fetches all lessons for a specific course.
 * 
 * @param {string|number} courseId - The unique identifier of the course.
 * @returns {Promise<any>} A promise that resolves to the course lessons data.
 * @throws {Error} If the API request fails.
 */
export const getAllLessonByCourse = async (courseId)=>{
  try {
    const response = await axiosInstance.get(ENDPOINTS.LESSONS_LIST(courseId))
    return response.data;
  } catch(error) {
    console.error("Error get all lessons data:", error);
    throw error;
  }
}


/**
 * Fetches the details of a specific lesson within a course.
 * 
 * @param {string|number} courseId - The unique identifier of the course.
 * @param {string|number} lessonId - The unique identifier of the lesson.
 * @returns {Promise<any>} A promise that resolves to the single lesson data.
 * @throws {Error} If the API request fails.
 */
export const getLessonById = async (courseId, lessonId)=>{
  try {
    const response = await axiosInstance.get(ENDPOINTS.LESSONS_GET(courseId, lessonId))
    return response.data;
  } catch(error) {
    console.error("Error get lesson data:", error);
    throw error;
  }
}






