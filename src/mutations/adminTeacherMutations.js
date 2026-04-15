import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminTeacherService";
import { toast } from "sonner";

/**
 * Custom hook to delete a user ( Teacher).
 * Automatically invalidates the "admin-users" query key to refresh the list after a successful deletion.
 * * @returns {import('@tanstack/react-query').UseMutationResult} Mutation object with mutate function and status.
 * @example
 * const { mutate: deleteUser } = useDeleteUserMutation();
 * deleteUser("user_id_123");
 */
export const useDeleteTeacherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      toast.success("Teacher deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Delete failed");
    },
  });
};
/**
 * Custom hook to toggle teacher account status between 'activate' and 'suspend'.
 * Automatically invalidates the "admin-users" query key to reflect status changes in the UI.
 * * @returns {import('@tanstack/react-query').UseMutationResult} Mutation object.
 * @example
 * const { mutate: toggleStatus } = useToggleUserStatusMutation();
 * toggleStatus({ id: "123", action: "activate" });
 */

export const useToggleTeacherStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }) => 
      action === 'activate' ? adminService.activateUser(id) : adminService.suspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["teachers"]);
      toast.success("Status updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Status update failed");
    },
  });
};