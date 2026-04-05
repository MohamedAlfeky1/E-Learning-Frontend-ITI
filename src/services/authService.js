import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";


export const register = async (userData) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_REGISTER, userData);
return response.data;
};

export const login = async (formData) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_LOGIN, formData);
return response.data;
};

export const getMe = async () => {
const response = await axiosInstance.get(ENDPOINTS.PROFILE_GET);
  return response.data.data; 
};
export const forgotPassword = async (emailData) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_FORGOT_PASSWORD, emailData);
 return response.data;
};
export const resetPassword = async (token, password) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_RESET_PASSWORD(token), { password });
return response.data;
};
export const googleLogin = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.AUTH_GOOGLE, data);
  return response.data;
};
export const logout = () => {
    localStorage.removeItem("token");
};
