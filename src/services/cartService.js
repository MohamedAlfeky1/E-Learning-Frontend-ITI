import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getCart = async () => {
  const response = await axiosInstance.get(ENDPOINTS.CART_GET);
  return response.data;
};

export const addToCart = async (courseId) => {
  const response = await axiosInstance.post(ENDPOINTS.CART_ADD, {
    courseId,
  });
  return response.data;
};

export const removeFromCart = async (courseId) => {
  const response = await axiosInstance.post(ENDPOINTS.CART_REMOVE, {
    courseId,
  });
  return response.data;
};
