import { getFavorites } from "@/services/favoritesService";
import { useQuery } from "@tanstack/react-query";

export const useFavorites = () => {
  return useQuery({ queryKey: ["favorites"], queryFn: getFavorites });
};
