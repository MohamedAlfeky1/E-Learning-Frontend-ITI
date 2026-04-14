import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminStudentService";
import { toast } from "sonner"; 
/**
 * Custom hook to delete a user (Student ).
 * Automatically invalidates the "admin-users" query key to refresh the list after a successful deletion.
 * * @returns {import('@tanstack/react-query').UseMutationResult} Mutation object with mutate function and status.
 * @example
 * const { mutate: deleteUser } = useDeleteUserMutation();
 * deleteUser("user_id_123");
 */

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUsersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      toast.success("Student deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete student");
    },
  });
};

/**
 * Custom hook to toggle student account status between 'activate' and 'suspend'.
 * Automatically invalidates the "admin-users" query key to reflect status changes in the UI.
 * * @returns {import('@tanstack/react-query').UseMutationResult} Mutation object.
 * @example
 * const { mutate: toggleStatus } = useToggleUserStatusMutation();
 * toggleStatus({ id: "123", action: "activate" });
 */
export const useToggleUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }) => {
      if (action === "activate") return adminUsersService.activateUser(id);
      return adminUsersService.suspendUser(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["admin-users"]);
      const msg = variables.action === "activate" ? "Student activated" : "Student suspended";
      toast.success(msg);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Status update failed");
    },
  });
};