import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/services/chatServices";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
  });
};
