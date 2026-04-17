import { addCourseReviews } from "@/services/reviewService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddReview=()=>{
     return useMutation({
        mutationFn : addCourseReviews,
        onSuccess :(response)=>{
            toast.success("Course Review Sends Successfully");

        },
        onError :(error)=>{
            toast.error(error.response?.data?.message || "Error Add Course Review , Try Again Later!")
        }
    })
}