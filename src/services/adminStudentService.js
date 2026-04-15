import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
export const adminUsersService = {
    getAllUsers: async (params) => {
    const response = await axiosInstance.get(ENDPOINTS  .ADMIN_USERS_LIST, {
      params: { ...params, role: 'student' } 
    });
    return response.data; 
  },
  getUserById: async (id) => {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_USER_BY_ID(id));
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
  },
  getStudentProfile: async (id) => {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_STUDENT_GET_PROFILE(id));
    return response.data;
  } 
};
