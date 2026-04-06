import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

export const submitVerification = async (payload) => {
  const { teacherId, certificates, experiences, targetCategories } = payload;

  const formData = new FormData();

  // 1. تحويل المصفوفات لـ Strings لأن الباك إند بيعمل JSON.parse
  // لو مبعوتوش كده السيرفر هيدي 500
  formData.append("targetCategories", JSON.stringify(targetCategories || []));
  formData.append("experiences", JSON.stringify(experiences || []));

  // 2. تحضير الـ Metadata للشهادات بنفس الطريقة
  const certificateData = certificates.map(cert => ({
    issuedBy: cert.issuedBy || "Not Specified",
    year: Number(cert.year) || new Date().getFullYear()
  }));
  formData.append("certificateData", JSON.stringify(certificateData));

  // 3. إرسال الملفات الفعلية (الصور/PDF)
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