import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getFavorites = async () => {
  const response = await axiosInstance.get(ENDPOINTS.FAVORITES_LIST);
  return response.data;
};

export const addFavorite = async (courseId) => {
  const response = await axiosInstance.post(ENDPOINTS.FAVORITES_ADD, {
    courseId,
  });
  return response.data;
};

export const removeFavorite = async (favoriteId) => {
  const response = await axiosInstance.delete(
    ENDPOINTS.FAVORITES_REMOVE(favoriteId),
  );
  return response.data;
};
