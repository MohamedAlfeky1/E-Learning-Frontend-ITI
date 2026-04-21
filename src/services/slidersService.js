import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getPublicSliders = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.SLIDERS_LIST);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSliders = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_SLIDERS_LIST);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addSlider = async (data) => {
  try {
    const response = await axiosInstance.post(
      ENDPOINTS.ADMIN_SLIDERS_CREATE,
      data,
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteSlider = async (id) => {
  try {
    const response = await axiosInstance.delete(
      ENDPOINTS.ADMIN_SLIDERS_DELETE(id),
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateSlider = async (id, data) => {
  try {
    const response = await axiosInstance.patch(
      ENDPOINTS.ADMIN_SLIDERS_UPDATE(id),
      data,
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const reorderSliders = async (orderData) => {
  try {
    const response = await axiosInstance.patch(
      ENDPOINTS.ADMIN_SLIDERS_REORDER,
      orderData,
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
