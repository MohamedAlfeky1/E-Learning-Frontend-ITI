import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getAllCategories = async () => {
  const response = await axiosInstance.get(ENDPOINTS.CATEGORIES_LIST);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await axiosInstance.get(ENDPOINTS.CATEGORY_BY_ID(id));
  return response.data;
};

export const addCategory = async ({ name, description, icon }) => {
  const response = await axiosInstance.post(ENDPOINTS.CATEGORIES_CREATE, {
    name,
    description,
    icon,
  });
  return response.data;
};

export const updateCategory = async ({ slug, name, description }) => {
  const response = await axiosInstance.put(ENDPOINTS.CATEGORIES_UPDATE(slug), {
    name,
    description,
  });
  return response.data;
};

export const deleteCategory = async (slug) => {
  const response = await axiosInstance.delete(
    ENDPOINTS.CATEGORIES_DELETE(slug),
  );
  return response.data;
};
