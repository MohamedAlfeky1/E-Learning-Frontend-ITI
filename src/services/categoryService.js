import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getAllCategories = async () => {
  const response = await axiosInstance.get(ENDPOINTS.CATEGORIES_LIST);
  return response.data;
};

export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addCategory = async ({ name, description, icon }) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.CATEGORIES_CREATE, {
      name,
      description,
      icon,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCategory = async ({ slug, name, description }) => {
  try {
    const response = await axiosInstance.put(
      ENDPOINTS.CATEGORIES_UPDATE(slug),
      {
        name,
        description,
      },
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteCategory = async (slug) => {
  try {
    const response = await axiosInstance.delete(
      ENDPOINTS.CATEGORIES_DELETE(slug),
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
