import { getFavorites } from "@/services/favoritesService";
import { useQuery } from "@tanstack/react-query";

export const useFavorites = (options = {}) => {
  return useQuery({ queryKey: ["favorites"], queryFn: getFavorites, ...options });
};
