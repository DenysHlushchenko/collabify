import type { AuthResponse, LoginType, RegisterType } from "@/modules/shared/types/types";
import {request} from "@/modules/shared/api/request";

export const registerUser = async (data: RegisterType): Promise<void> => {
  await request.post(`/auth/register`, data);
};

export const loginUser = async (data: LoginType): Promise<AuthResponse> => {
  const res = await request.post(`/auth/login`, data);
  return res.data;
};
