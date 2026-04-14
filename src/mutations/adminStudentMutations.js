import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminStudentService";
import { toast } from "sonner"; 

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUsersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useToggleUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }) => {
      if (action === "activate") return adminUsersService.activateUser(id);
      return adminUsersService.suspendUser(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["admin-users"]);
      const msg = variables.action === "activate" ? "User activated" : "User suspended";
      toast.success(msg);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Status update failed");
    },
  });
};