import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

export const quizApi = {
  // Get all quizzes for a course
  getAll: (courseId) => 
    axiosInstance.get(ENDPOINTS.QUIZZES_LIST(courseId)),
  getById: (id) => 
    axiosInstance.get(ENDPOINTS.QUIZZES_GET(id)),
  // Create quiz 
  create: (data) => 
    axiosInstance.post(ENDPOINTS.QUIZZES_CREATE, data),

  // Update quiz
  update: (id, data) => 
    axiosInstance.put(ENDPOINTS.QUIZZES_UPDATE(id), data),

  // Delete quiz
  delete: (id) => 
    axiosInstance.delete(ENDPOINTS.QUIZZES_DELETE(id)),

  // Start quiz (get questions without answers)
  start: (id) => 
    axiosInstance.get(ENDPOINTS.QUIZZES_START(id)),

  // Submit quiz answers
  submit: (id, answers) => 
    axiosInstance.post(ENDPOINTS.QUIZZES_SUBMIT(id), { answers }),

  // Get quiz result
  getResult: (id) => 
    axiosInstance.get(ENDPOINTS.QUIZZES_RESULT(id)),

  // Generate quiz using AI
  generateAI: (data) => 
    axiosInstance.post(ENDPOINTS.QUIZZES_GENERATE_AI, data),

  // Get all quizzes for a course (student view)
  getForStudent: (courseId) =>
    axiosInstance.get(ENDPOINTS.QUIZZES_LIST_FOR_STUDENT(courseId)),

  // Get quiz results and statistics (teacher view)
  getTeacherResults: (quizId) =>
    axiosInstance.get(ENDPOINTS.QUIZZES_TEACHER_RESULTS(quizId)),
};
