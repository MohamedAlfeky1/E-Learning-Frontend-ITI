import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
export const adminService = {
  getAllTeachers: async (params) => {
    const response = await axiosInstance.get(ENDPOINTS  .ADMIN_USERS_LIST, {
      params: { ...params, role: 'teacher' } 
    });
    return response.data; 
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(ENDPOINTS.ADMIN_USER_DELETE(id));
    return response.data;
  },

  activateUser: async (id) => {
    const response = await axiosInstance.put(ENDPOINTS.ADMIN_USER_ACTIVATE(id));
    return response.data;
  },

  suspendUser: async (id) => {
    const response = await axiosInstance.put(ENDPOINTS.ADMIN_USER_SUSPEND(id));
    return response.data;
  }
};