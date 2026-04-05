import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { submitVerification } from "../services/verificationService";

import { toast } from "sonner";

export const useSubmitVerification = () => {
//   const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitVerification,
    onSuccess: () => {
      toast.success("Verification Request Sent", {
        description: "Admin will review your documents. You'll be notified soon.",
      });

      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      
      toast.error("Submission Failed", {
        description: errorMessage,
      });
    }
  });
};