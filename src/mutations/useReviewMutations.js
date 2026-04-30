import { addCourseReviews, deleteCourseReviews } from "@/services/reviewService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCourseReviews,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["courseReviews"] });
            toast.success("Course Review Sends Successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error Add Course Review , Try Again Later!")
        }
    })
}

export const useDeleteReview = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: deleteCourseReviews,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courseReviews"] });
            toast.success("Course Review Deleted Successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error Delete Course Review , Try Again Later!")
        }
    })
}