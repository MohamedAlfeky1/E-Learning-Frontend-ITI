import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../services/paymentServics"; 
export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: (paymentData) => createPaymentIntent(paymentData),
    onSuccess: (data) => {
      console.log("Stripe Intent Created:", data.clientSecret);
    },
    onError: (error) => {
      console.error("Checkout Error:", error);
    }
  });
};