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

export const deleteCourseReviews = async (courseId) => {
    try {
        const response = await axiosInstance.delete(ENDPOINTS.REVIEWS_DELETE(courseId));
        return response.data;
    } catch (error) {
        console.error("Error Deleting course reviews:", error);
        throw error;
    }
}

export const getMyCourseReviews = async (courseId , studentId) => {
    try {
        const response = await axiosInstance.get(ENDPOINTS.MY_REVIEW_COURSE_BY_ID(courseId , studentId));
        return response.data;
    } catch (error) {
        console.error("Error fetching MY course reviews:", error);
        throw error;
    }
}


export const addCourseReviews = async (commentData) => {
    try {
        const response = await axiosInstance.post(ENDPOINTS.REVIEWS_CREATE, commentData);
        return response.data;
    } catch (error) {
        console.error("Error Add course review:", error);
        throw error;
    }
}