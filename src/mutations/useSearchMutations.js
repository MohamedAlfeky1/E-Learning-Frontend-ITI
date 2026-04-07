import { browseCourses } from "@/services/courseService";
import { useMutation } from "@tanstack/react-query";

export const useSearchCourses=async()=>{
     return useMutation({
        mutationFn : browseCourses,
        onSuccess :(response)=>{
            toast.success("Search Data Sends Successfully");

        },
        onError :(error)=>{
            toast.error(error.response?.data?.message || "Error Search Courses , Try Again Later!")
        }
    })
}