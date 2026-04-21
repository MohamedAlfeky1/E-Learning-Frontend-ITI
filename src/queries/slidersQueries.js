import { getPublicSliders, getSliders } from "@/services/slidersService";
import { useQuery } from "@tanstack/react-query";

export const usePublicSliders = () => {
  return useQuery({ queryKey: ["publicSliders"], queryFn: getPublicSliders });
};

export const useSliders = () => {
  return useQuery({ queryKey: ["sliders"], queryFn: getSliders });
};
