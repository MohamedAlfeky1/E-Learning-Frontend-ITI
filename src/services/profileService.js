import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";


/**update Profile data  firstName, lastName, bio, phone , avatar */
export const updateProfile = async(updatedData) =>{
    const response = await axiosInstance.put(ENDPOINTS.PROFILE_UPDATE, updatedData)
    return response.data;
}

/**user update his password */
export const updatePassword = async(updatedData) =>{
    const response = await axiosInstance.put(ENDPOINTS.PROFILE_CHANGE_PASSWORD,updatedData)
    return response.data;
}

/*teacher get his courses*/
export const getMyCourses = async() =>{
    const response = await axiosInstance.get(ENDPOINTS.COURSES_MY)
    return response.data
}