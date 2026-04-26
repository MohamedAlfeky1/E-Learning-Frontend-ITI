import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

/**
 * Sends teacher verification data (certificates, experience, and categories) to the server.
 * Uses FormData to handle file uploads and JSON-stringified metadata.
 * * @param {Object} payload - The verification data object.
 * @param {string} payload.teacherId - The unique ID of the teacher.
 * @param {Array<Object>} payload.certificates - Array of certificate objects containing file, issuedBy, and year.
 * @param {Array<Object>} payload.experiences - Array of professional experience objects.
 * @param {Array<string>} payload.targetCategories - List of subject categories the teacher wants to teach.
 * * @returns {Promise<Object>} The server response data.
 * @throws {Error} If the API request fails.
 */


export const submitVerification = async (payload) => {
  let formData;
  let teacherId;

  if (payload instanceof FormData) {
    formData = payload;
    teacherId = formData.get("teacherId");
  } else {
    teacherId = payload.teacherId;

    formData = new FormData();

    formData.append("targetCategories", JSON.stringify(payload.targetCategories || []));
    formData.append("experiences", JSON.stringify(payload.experiences || []));

    const certificateData = (payload.certificates || []).map((c) => ({
      issuedBy: c.issuedBy,
      year: c.year,
    }));

    formData.append("certificateData", JSON.stringify(certificateData));

    (payload.certificates || []).forEach((cert) => {
      if (cert.file) {
        formData.append("certificates", cert.file);
      }
    });
  }

  if (!teacherId) {
    throw new Error("Teacher ID is missing");
  }

  const response = await axiosInstance.post(
    ENDPOINTS.TEACHER_VERIFICATION_SUBMIT(teacherId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const getAllVerifications = async ()=>{
    try{
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_VERIFICATIONS_LIST);
    return response.data
    }catch(error){
        console.error("Error get all password :", error);
        throw error;
    }
}