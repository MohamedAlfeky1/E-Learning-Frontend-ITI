import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";


export const getCourseReviews = async (courseId) => {
    try {
        const response = await axiosInstance.get(ENDPOINTS.REVIEW_COURSE_BY_ID(courseId));
        return response.data;
    } catch (error) {
        console.error("Error fetching course reviews:", error);
        throw error;
    }
}