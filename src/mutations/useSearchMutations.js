import { browseCourses } from "@/services/courseService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSearchCourses=()=>{
     return useMutation({
        mutationFn : browseCourses,
        onSuccess :(response)=>{
            console.log("Search Data Sends Successfully",response);

        },
        onError :(error)=>{
            console.log(error.response?.data?.message || "Error Search Courses , Try Again Later!")
        }
    })
}