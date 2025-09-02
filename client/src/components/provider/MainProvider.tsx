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
import api from "@/api/axios";
import { CONFIG } from "@/config/_config";

export default function MainProvider({ children }: { children: React.ReactNode }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);

useEffect(() => {
  async function refresh() {
    try {
      // ✅ Token refresh
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh`,
        {},
        { withCredentials: true }
      );

      setAccessToken(data.accessToken);
    } catch (err: any) {
      // ✅ Session clear
      setAccessToken(null);
      clearAuth();
      toast.dismiss();

      // ✅ Agar user logged in tha tabhi logout aur toast
      if (user) {
        // Show session expired
        toast.error("Session expired, please login again");

        try {
          // Server ko bhi logout inform kar do
          await api.post("/auth/me/logout", {}, { withCredentials: true });
        } catch (logoutErr) {
          console.error("Logout failed:", logoutErr);
        }

        // Redirect to login page
        window.location.href = CONFIG.CONSTANT.ROUTES.SIGNIN;
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
