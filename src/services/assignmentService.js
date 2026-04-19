import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

// ─── Teacher: Assignment CRUD ─────────────────────────────────────────────────

/** Get all assignments for a course */
export const getAssignments = async (courseId) => {
  const response = await axiosInstance.get(ENDPOINTS.ASSIGNMENTS_LIST(courseId));
  return response.data;
};

/** Create a new assignment (supports file attachments via FormData) */
export const createAssignment = async (courseId, data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("dueDate", data.dueDate);
  if (data.maxScore) formData.append("maxScore", data.maxScore);
  if (data.attachments) {
    for (const file of data.attachments) {
      formData.append("attachments", file);
    }
  }
  const response = await axiosInstance.post(
    ENDPOINTS.ASSIGNMENTS_CREATE(courseId),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

/** Update an assignment */
export const updateAssignment = async (id, data) => {
  const response = await axiosInstance.patch(
    ENDPOINTS.ASSIGNMENTS_UPDATE(id),
    data
  );
  return response.data;
};

/** Delete an assignment */
export const deleteAssignment = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.ASSIGNMENTS_DELETE(id));
  return response.data;
};

// ─── Teacher: Submissions & Grading ───────────────────────────────────────────

/** Get all submissions for an assignment */
export const getSubmissions = async (assignmentId) => {
  const response = await axiosInstance.get(
    ENDPOINTS.ASSIGNMENTS_SUBMISSIONS_LIST(assignmentId)
  );
  return response.data;
};

/** Grade a student's submission */
export const gradeSubmission = async (assignmentId, sid, data) => {
  const response = await axiosInstance.patch(
    ENDPOINTS.ASSIGNMENTS_GRADE(assignmentId, sid),
    data
  );
  return response.data;
};

// ─── Student ──────────────────────────────────────────────────────────────────

/** Submit an assignment */
export const submitAssignment = async (assignmentId, data) => {
  const response = await axiosInstance.post(
    ENDPOINTS.ASSIGNMENTS_SUBMIT(assignmentId),
    data
  );
  return response.data;
};

/** Get my submission for an assignment */
export const getMySubmission = async (assignmentId) => {
  const response = await axiosInstance.get(
    ENDPOINTS.ASSIGNMENTS_MY_SUBMISSION(assignmentId)
  );
  return response.data;
};

/** Get my grades for a course */
export const getMyCourseGrades = async (courseId) => {
  const response = await axiosInstance.get(
    ENDPOINTS.ASSIGNMENTS_MY_GRADES(courseId)
  );
  return response.data;
};
