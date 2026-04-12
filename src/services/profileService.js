import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";


/**update Profile data  firstName, lastName, bio, phone , avatar */
export const updateProfile = async (updatedData) => {
    try {
        const response = await axiosInstance.put(ENDPOINTS.PROFILE_UPDATE, updatedData)
        return response.data;
    } catch (error) {
        console.error("Error update profile :", error);
        throw error;
    }
}

/**user update his password */
export const updatePassword = async (updatedData) => {
    try {
        const response = await axiosInstance.put(ENDPOINTS.PROFILE_CHANGE_PASSWORD, updatedData)
        return response.data;
    } catch (error) {
        console.error("Error update password :", error);
        throw error;
    }
}

/*teacher get his courses*/
export const getMyCourses = async () => {
    try {
        const response = await axiosInstance.get(ENDPOINTS.COURSES_MY)
        return response.data
    } catch (error) {
        console.error("Error get all courses  :", error);
        throw error;
    }
}