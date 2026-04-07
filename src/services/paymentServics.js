import axiosInstance from "../api/axiosInstance"; 
import { ENDPOINTS } from "../api/endpoints"; 

export const createPaymentIntent = async (paymentData) => {
  // paymentData: { voucherCode, bookingId }
    const response = await axiosInstance.post(ENDPOINTS.PAYMENTS_CREATE_INTENT, paymentData);

    return response.data.data; 
};