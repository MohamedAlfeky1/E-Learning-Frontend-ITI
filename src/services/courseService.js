import axios from "axios";
import { endpoints } from "./endpoints";

// Find a specific course by its ID
export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`/api/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

// Update/Submit course status (using POST)
export const postCourseStatus = async (id, statusData) => {
  try {
    // This utilizes the COURSES_STATUS function from endpoints.js
    const url = endpoints.COURSES_STATUS(id);
    const response = await axios.post(url, statusData);
    return response.data;
  } catch (error) {
    console.error("Error posting course status:", error);
    throw error;
  }
};
