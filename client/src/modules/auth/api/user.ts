import type { AuthResponse, LoginType, RegisterType } from "@/modules/shared/types/types";
import axios from "axios";

export const registerUser = async (data: RegisterType): Promise<void> => {
  return await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, data);
};

export const loginUser = async (data: LoginType): Promise<AuthResponse> => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, data);
  return res.data;
};
