import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getPublicSliders = async () => {
  const response = await axiosInstance.get(ENDPOINTS.SLIDERS_LIST);
  return response.data;
};

export const getSliders = async () => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN_SLIDERS_LIST);
  return response.data;
};

export const addSlider = async (data) => {
  const response = await axiosInstance.post(
    ENDPOINTS.ADMIN_SLIDERS_CREATE,
    data,
  );
  return response.data;
};

export const deleteSlider = async (id) => {
  const response = await axiosInstance.delete(
    ENDPOINTS.ADMIN_SLIDERS_DELETE(id),
  );
  return response.data;
};
