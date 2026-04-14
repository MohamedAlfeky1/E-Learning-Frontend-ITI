import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getAllCategory = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORIES_LIST);
    return response.data;
  } catch (error) {
    console.error("Error get All Category :", error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error("Error get Category By Id:", error);
    throw error;
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
    console.log("Error addCategory: ", error);
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
    console.log("Error updateCategory: ", error);
  }
};
