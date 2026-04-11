import { useQuery } from "@tanstack/react-query";
import { getMyTickets, getTicketById,getAllTickets } from "@/services/ticketService";
/**
 * Hook to fetch the list of tickets for the currently authenticated user.
 * @returns {import("@tanstack/react-query").UseQueryResult<any[]>} Query result object containing tickets array and loading state.
 */
export const useMyTicketsQuery = () => {
  return useQuery({
    queryKey: ["myTickets"],
    queryFn: getMyTickets,
    select: (response) => response?.data || [], 
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
/**
 * Hook to fetch the details of a specific ticket by its ID.
 * @param {string|number} id - The unique identifier of the ticket.
 * @returns {import("@tanstack/react-query").UseQueryResult<any>} Query result object containing ticket details and messages.
 */
export const useTicketQuery = (id) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id),
    enabled: !!id,

    select: (res) => res?.data?.data, 
  });
};
/**
 * Hook to fetch all tickets for the Admin/Support team.
 * @param {string} [status] - Optional filter by ticket status.
 * @returns {import("@tanstack/react-query").UseQueryResult<any[]>}
 */
export const useAllTicketsQuery = (status) => {
  return useQuery({
    queryKey: ["adminTickets", status],
    queryFn: () => getAllTickets(status),
    select: (res) => res?.data?.data || res?.data, 
    staleTime: 0,
  });
};