import { verificationDecision } from "@/services/adminVerificationService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


/**
 * Admin submit verification decision mutation.
 * This mutation is used by admins to approve or reject teacher verification requests.
 * It accepts the teacher's ID, the admin's decision (approved/rejected), an optional note,
 * and metadata about who made the decision and when. On success, it triggers a toast notification
 * and refetches the user's session to reflect any changes in verification status.
 */
export const useAdminVerificationDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verificationDecision,
    onSuccess: () =>{
        toast.success("Decision Submitted", {
            description: "The teacher's verification status has been updated."
        });
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

        queryClient.refetchQueries({ queryKey: ["verifications" ] });
        queryClient.invalidateQueries({ queryKey: ["verifications"] });

    },
    onError: (error) => {
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        toast.error("Submission Failed", {
            description: errorMessage,
        });
    }
  })

}