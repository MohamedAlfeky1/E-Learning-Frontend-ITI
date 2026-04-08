import { browseCourses } from "@/services/courseService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSearchCourses=()=>{
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