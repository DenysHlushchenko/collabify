import { request } from "@/modules/shared/api/request";
import type { UserType } from "@/modules/shared/types/types";

export const getCurrentUser = async (id: number): Promise<UserType> => {
  const res = await request.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: number, data: Partial<UserType>): Promise<void> => {
  await request.put(`/users/${id}`, data);
};
