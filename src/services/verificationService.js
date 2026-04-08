import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file); 

  const response = await axiosInstance.post(ENDPOINTS.UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data.url || response.data.data?.url;
};

export const submitVerification = async (payload) => {
  const { teacherId, ...data } = payload;
  const response = await axiosInstance.post(
    ENDPOINTS.TEACHER_VERIFICATION_SUBMIT(teacherId), 
    data
  );

  return response.data;
};