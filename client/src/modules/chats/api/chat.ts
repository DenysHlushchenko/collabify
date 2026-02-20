import { request } from "@/modules/shared/api/request";
import type { ChatType } from "@/modules/shared/types/types";

export const getAllChatsByUserId = async (userId: number): Promise<ChatType[]> => {
  const res = await request.get(`/chats/users/${userId}`);
  return res.data;
};
