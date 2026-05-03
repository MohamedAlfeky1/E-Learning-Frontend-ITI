import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { submitVerification } from "../services/verificationService";

import { toast } from "sonner";

/**
 * Handles the submission of teacher verification documents.
 * On success, triggers a toast and unconditionally refetches the latest 
 * user session ("auth", "me") to reflect any new verification status.
 */
export const useSubmitVerification = () => {
//   const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitVerification,
    onSuccess: () => {
      toast.success("Verification Request Sent", {
        description: "Admin will review your documents. You'll be notified soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });

      
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      
      toast.error("Submission Failed", {
        description: errorMessage,
      });
    }
  });
};