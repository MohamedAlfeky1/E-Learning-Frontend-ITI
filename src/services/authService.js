import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";


/** Registers a new user via API */
export const register = async (userData) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_REGISTER, userData);
return response.data;
};

/** Authenticates user and returns JWT token */
export const login = async (formData) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_LOGIN, formData);
return response.data;
};

/** Fetches current authenticated user profile */
export const getMe = async () => {
const response = await axiosInstance.get(ENDPOINTS.PROFILE_GET);
  return response.data.data; 
};
/** Requests a password reset email */
export const forgotPassword = async (emailData) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_FORGOT_PASSWORD, emailData);
  return response.data;
};
/** Resets password using an email token */
export const resetPassword = async (token, password) => {
const response = await axiosInstance.post(ENDPOINTS.AUTH_RESET_PASSWORD(token), { password });
return response.data;
};
/** Authenticates user via Google SSO */
export const googleLogin = async (data) => {
  const response = await axiosInstance.post(ENDPOINTS.AUTH_GOOGLE, data);
  return response.data;
};
/** Clears authentication token from local storage */
export const logout = () => {
    localStorage.removeItem("token");
};
