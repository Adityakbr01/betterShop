// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuthStore } from "../store/auth";

export const useUser = () => {
  const { setUser, user, accessToken } = useAuthStore();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/auth/me");
      setUser(data);
      return data;
    },
    initialData: user,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
