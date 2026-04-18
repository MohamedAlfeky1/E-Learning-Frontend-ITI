import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";

// User
export const createTicket = (data) =>
  axiosInstance.post(ENDPOINTS.SUPPORT_CREATE, data);

export const getMyTickets = () =>
  axiosInstance.get(ENDPOINTS.SUPPORT_MY_TICKETS);

export const getTicketById = (id) =>
  axiosInstance.get(ENDPOINTS.SUPPORT_GET(id));

export const replyToTicket = (id, message) =>
  axiosInstance.post(ENDPOINTS.SUPPORT_REPLY(id), { message });

// Admin
export const getAllTickets = (status) =>
  axiosInstance.get(ENDPOINTS.ADMIN_TICKETS_LIST, {
    params: { status },
  });

export const adminReply = (id, data) =>
  axiosInstance.post(ENDPOINTS.ADMIN_TICKET_REPLY(id), data);

export const updateTicketStatus = (id, status) =>
  axiosInstance.put(ENDPOINTS.ADMIN_TICKET_STATUS(id), { status });

export const deleteTicket = (id) =>
  axiosInstance.delete(ENDPOINTS.ADMIN_TICKET_DELETE(id));