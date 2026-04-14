import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";


export const addToCart = async (courseId) => {
    try {
        const response = await axiosInstance.post(ENDPOINTS.CART_ADD, { courseId: courseId })
        return response.data
    } catch (error) {
        console.error("Error Add Course To Cart:", error);
        throw error;
    }
}

export const getCart = async () => {
    try {
        const response = await axiosInstance.get(ENDPOINTS.CART_GET)
        return response.data;

    } catch (error) {
        console.error("Error get Cart Items :", error);
        throw error;
    }
}