// api/axios.ts
import axios from "axios";
import { useAuthStore } from "../store/auth";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  withCredentials: true, // send refresh token cookie automatically
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return axios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { setAccessToken, clearAuth } = useAuthStore.getState();

      try {
        const { data } = await axios.post("/auth/refresh", {}, { withCredentials: true });
        console.log("Refresh token",data.accessToken);
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        toast.error("Session expired, please login again");
        clearAuth();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
        // Global toast error handling
    if (error.response) {
      const status = error.response.status;

      if (status === 429) toast.error("Please wait before requesting another OTP");
      else if (status >= 500) toast.error("Server error, please try again later");
      else if (status === 400) toast.error(error?.response?.data?.message || "Bad request");
      else if (status === 409) toast.error(error?.response?.data?.message || "Bad request");
      else if (status === 404) toast.error(error?.response?.data?.message || "Bad request");
      else if (status === 401) toast.error(error?.response?.data?.message || "Bad request");
      else if (status === 403) toast.error(error?.response?.data?.message || "Bad request");
    } else {
      toast.error("Network error, check your connection");
    }
    return Promise.reject(error);
  }
);

export default api;
