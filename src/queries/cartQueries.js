import { getCart } from "@/services/cartService";
import { useQuery } from "@tanstack/react-query";

export const useCart = () => {
  return useQuery({ queryKey: ["cart"], queryFn: getCart });
};
