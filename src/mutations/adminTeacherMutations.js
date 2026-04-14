import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminTeacherService";
import { toast } from "sonner";

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