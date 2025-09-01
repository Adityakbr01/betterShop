"use client";

import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { useEffect } from "react";
import LenisProvider from "./LenisProvider";
import ReactToast from "./ReactToast";
import { TanStackProvider } from "./tanstack-provider";
import toast from "react-hot-toast";

export default function MainProvider({ children }: { children: React.ReactNode }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function refresh() {
      try {
        // Only attempt refresh if user is null (guest) 
        // or if you want to check a cookie first
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
      } catch (err: any) {
        setAccessToken(null);
        clearAuth();
        // ✅ Only show toast if user existed before (session expired)
        if (user) {
          toast.error("Session expired, please login again");
        }
      }
    }

    refresh();
  }, [setAccessToken, clearAuth, user]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LenisProvider>
        <TanStackProvider>
          <Navbar />
          {children}
          <ReactToast />
        </TanStackProvider>
      </LenisProvider>
    </ThemeProvider>
  );
}
