import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTicket,
  replyToTicket,
  adminReply,
  updateTicketStatus,
  deleteTicket,
} from "@/services/ticketService";
import { toast } from "sonner";
/**
 * Hook to create a new support ticket.
 * Invalidates ['myTickets'] on success.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */

export const useCreateTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,

    onSuccess: () => {
      toast.success("Ticket created successfully ");
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Something went wrong "
      );
    },
  });
};

/**
 * Hook for a user to reply to an existing ticket.
 * @param {Object} params - The mutation parameters.
 * @param {string} params.id - The ticket ID.
 * @param {string} params.message - The reply message content.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useReplyTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }) =>
      replyToTicket(id, message),

    onSuccess: (_, variables) => {
      toast.success("Reply Sent Successfully ");

      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["myTickets"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error sending reply "
      );
    },
  });
};
/**
 * Hook for an admin to reply to a ticket.
 * @param {Object} params - The mutation parameters.
 * @param {string} params.id - The ticket ID.
 * @param {Object} params.data - The reply data object.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */

export const useAdminReplyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      adminReply(id, data),

    onSuccess: (_, variables) => {
      toast.success("Reply sent as admin ");

      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["adminTickets"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error "
      );
    },
  });
};
/**
 * Hook to update the status (e.g., open, resolved) of a ticket.
 * @param {Object} params - The mutation parameters.
 * @param {string} params.id - The ticket ID.
 * @param {string} params.status - The new status string.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useUpdateTicketStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      updateTicketStatus(id, status),

    onSuccess: () => {
      toast.success("Status updated ");

      queryClient.invalidateQueries({
        queryKey: ["adminTickets"],
      });

      queryClient.invalidateQueries({
        queryKey: ["ticket"],
      });
    },

    onError: () => {
      toast.error("Error updating status ");
    },
  });
};

/**
 * Hook to delete a ticket by its ID.
 * @param {string} id - The ticket ID to be deleted.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useDeleteTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTicket,

    onSuccess: () => {
      toast.success("Ticket Deleted Successfully ");

      queryClient.invalidateQueries({
        queryKey: ["adminTickets"],
      });
    },

    onError: () => {
      toast.error("Error Deleting Ticket ");
    },
  });
};