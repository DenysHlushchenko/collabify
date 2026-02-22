import { request } from "@/modules/shared/api/request";
import type { EditUserType, UserTypeWithStats } from "@/modules/shared/types/types";

export const getCurrentUser = async (id: number): Promise<UserTypeWithStats> => {
  const res = await request.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: number, data: EditUserType): Promise<void> => {
  await request.put(`/users/${id}`, data);
};
