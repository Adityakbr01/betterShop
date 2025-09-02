// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};
