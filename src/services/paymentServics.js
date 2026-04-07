import axiosInstance from "../api/axiosInstance"; 
import { ENDPOINTS } from "../api/endpoints"; 
/**
 * Sends a request to the backend to create a Stripe Payment Intent.
 * This is the first step in the payment process to secure a transaction.
  * @param {Object} paymentData - An object containing necessary information for creating a payment intent, such as voucher code and booking ID.
 * @returns {Promise<Object>} The payment intent data containing the clientSecret.
 */

export const createPaymentIntent = async (paymentData) => {
  // paymentData: { voucherCode, bookingId }
    const response = await axiosInstance.post(ENDPOINTS.PAYMENTS_CREATE_INTENT, paymentData);

    return response.data.data; 
};