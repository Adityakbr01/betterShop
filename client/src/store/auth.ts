// store/auth.ts
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
  clearAuth: () => {
    set({ accessToken: null, user: null });
    if (typeof window !== "undefined") localStorage.removeItem("user");
  },
}));
