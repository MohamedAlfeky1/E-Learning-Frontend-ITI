import axiosInstance from './axiosInstance';

export const getRagStatus = async (lessonId) => {
  const response = await axiosInstance.get(`chatBot/status/${lessonId}`);
  return response.data;
};

export const processLessonVideo = async (lessonId) => {
  const response = await axiosInstance.post(`chatBot/process/${lessonId}`);
  return response.data;
};

export const getRagSuggestions = async (lessonId) => {
  const response = await axiosInstance.get(`chatBot/suggestions/${lessonId}`);
  return response.data;
};

export const askRagQuestion = async (lessonId, question) => {
  const response = await axiosInstance.post(`chatBot/ask/${lessonId}`, { question });
  return response.data;
};
