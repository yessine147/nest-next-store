import axios, { AxiosError } from "axios";
import { getAccessToken } from "./auth";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

export const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      console.error(
        `❌ Network Error: Cannot reach backend at ${baseURL}. Make sure the backend is running.`,
      );
    } else if (error.response?.status === 401) {
      // Unauthorized - token might be invalid
      console.warn("⚠️ Unauthorized: Token may be invalid");
      localStorage.removeItem("accessToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

