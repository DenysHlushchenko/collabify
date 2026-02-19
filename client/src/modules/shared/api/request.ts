import { useAuthStore } from "@/modules/auth/store/userStore";
import axios from "axios";

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Adding authorization for the request if client contains a valid token.
 */
request.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
