import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

export const getLessonsByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.LESSONS_LIST(courseId));
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLessonById = async (courseId, lessonId) => {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.LESSONS_GET(courseId, lessonId),
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createLesson = async ({ courseId, data }) => {
  try {
    const response = await axiosInstance.post(
      ENDPOINTS.LESSONS_CREATE(courseId),
      data,
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const reorderLessons = async ({ courseId, lessons }) => {
  try {
    const response = await axiosInstance.patch(
      ENDPOINTS.LESSONS_REORDER(courseId),
      { lessons },
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateLesson = async ({ courseId, lessonId, data }) => {
  try {
    const response = await axiosInstance.put(
      ENDPOINTS.LESSONS_UPDATE(courseId, lessonId),
      data,
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteLesson = async ({ courseId, lessonId }) => {
  try {
    const response = await axiosInstance.delete(
      ENDPOINTS.LESSONS_DELETE(courseId, lessonId),
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadLessonVideos = async ({ lessonId, files }) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("videos", file));
    const response = await axiosInstance.patch(
      ENDPOINTS.LESSONS_UPLOAD_VIDEO(lessonId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadLessonMaterials = async ({ lessonId, files }) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("materials", file));
    const response = await axiosInstance.patch(
      ENDPOINTS.LESSONS_UPLOAD_MATERIAL(lessonId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
