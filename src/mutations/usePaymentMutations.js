import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../services/paymentServics"; 
import { toast } from "sonner";
/**
 * Custom hook to manage the payment checkout process.
 * Triggers the creation of a Stripe Payment Intent and handles 
 * the success and error states of the transaction.
 */
export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: (paymentData) => createPaymentIntent(paymentData),
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to initialize payment");
    }
  });
};