import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
/**
 * Service object for handling Voucher-related API requests.
 */

export const voucherService = {
  getAllVouchers: async () => {
    const response = await axiosInstance.get(ENDPOINTS.ADMIN_VOUCHERS_LIST);
    return response.data.data;
  },

  createVoucher: async (voucherData) => {
    const response = await axiosInstance.post(
      ENDPOINTS.ADMIN_VOUCHERS_CREATE,
      voucherData,
    );
    return response.data.data;
  },

  deleteVoucher: async (id) => {
    const response = await axiosInstance.delete(
      ENDPOINTS.ADMIN_VOUCHERS_DELETE(id),
    );
    return response.data;
  },

  updateVoucher: async ({ id, data }) => {
    const response = await axiosInstance.patch(
      ENDPOINTS.ADMIN_VOUCHERS_UPDATE(id),
      data,
    );
    return response.data.data;
  },

  applyVoucher: async ({ code }) => {
    const response = await axiosInstance.post(ENDPOINTS.ADMIN_VOUCHERS_APPLY, {
      code,
    });
    return response.data.data;
  },
};
