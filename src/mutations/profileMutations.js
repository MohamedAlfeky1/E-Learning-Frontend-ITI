import { useMutation, useQueryClient } from "@tanstack/react-query";
/**
 * useMutation: تبعت بيانات للسيرفر (تحديث/حذف/إضافة).
useQueryClient: تتحكم في الكاش، وتقدر تحدث البيانات بعد أي تعديل.
 */
import { updatePassword, updateProfile } from "@/services/profileService";
import { toast } from "sonner";


export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (response) => {
            toast.success("Profile Data Updated Successfully");
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error Profile Update , Try Again Later!")
        }
    })
}

export const useUpdatePasswordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePassword,
        onSuccess: (response) => {
            toast.success("Password Updated Successfully");
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Error Password Update , Try Again Later!")
        }
    })
}