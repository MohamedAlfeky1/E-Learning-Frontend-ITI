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
  const { teacherId, certificates, experiences, targetCategories } = payload;

  const formData = new FormData();

  formData.append("targetCategories", JSON.stringify(targetCategories));
  formData.append("experiences", JSON.stringify(experiences));

  const certificateMetadata = certificates
    .filter(cert => cert.file !== null) 
    .map(cert => ({
      issuedBy: cert.issuedBy || "Not Specified",
      year: cert.year || "N/A"
    }));

  formData.append("certificateData", JSON.stringify(certificateMetadata));

  certificates.forEach(cert => {
    if (cert.file) {
      formData.append("certificates", cert.file);
    }
  });

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