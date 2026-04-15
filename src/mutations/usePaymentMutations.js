import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../services/paymentServics"; 
/**
 * Custom hook to manage the payment checkout process.
 * Triggers the creation of a Stripe Payment Intent and handles 
 * the success and error states of the transaction.
 */
export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: (paymentData) => createPaymentIntent(paymentData),
  });
};