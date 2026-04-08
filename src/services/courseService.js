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

//list all courses (using GET)
export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.COURSES_LIST)
    return response.data;
  } catch(error) {
    console.error("Error get all courses data:", error);
    throw error;
  }
}

//browse & search courses
export const browseCourses = async (data)=>{
   try {
    const response = await axiosInstance.post(ENDPOINTS.COURSES_SEARCH,data)
    console.log("Browse courses response:", response);
    
    return response.data;
  } catch(error) {
    console.error("Error browse courses :", error);
    throw error;
  }
}