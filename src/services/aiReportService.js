import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

export const aiReportService = {
  getReport: async (courseId) => {
    const response = await axiosInstance.get(ENDPOINTS.REPORTS_GET(courseId));
    return response.data;
  },
  generateReport: async (courseId) => {
    const response = await axiosInstance.post(ENDPOINTS.REPORTS_GENERATE(courseId));
    return response.data;
  },
};
