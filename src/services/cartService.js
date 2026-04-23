import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getCart = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CART_GET);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addToCart = async (courseId) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.CART_ADD, {
      courseId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeFromCart = async (courseId) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.CART_REMOVE, {
      courseId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
