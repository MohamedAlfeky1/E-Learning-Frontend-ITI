import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints"


export const getAllLessonByCourse = async (courseId)=>{
  try {
    const response = await axiosInstance.get(ENDPOINTS.LESSONS_LIST(courseId))
    return response.data;
  } catch(error) {
    console.error("Error get all lessons data:", error);
    throw error;
  }
}

export const getLessonById = async (courseId, lessonId)=>{
  try {
    const response = await axiosInstance.get(ENDPOINTS.LESSONS_GET(courseId, lessonId))
    return response.data;
  } catch(error) {
    console.error("Error get lesson data:", error);
    throw error;
  }
}