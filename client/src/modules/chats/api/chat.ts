import { request } from "@/modules/shared/api/request";
import type { ChatType } from "@/modules/shared/types/types";

export const getAllChatsByUserId = async (userId: number): Promise<ChatType[]> => {
  const res = await request.get(`/chats/users/${userId}`);
  return res.data;
};

export const getChatByUserId = async (chatId: number, userId: number): Promise<ChatType> => {
  const res = await request.get(`/chats/${chatId}/users/${userId}`);
  return res.data;
};

export const getChatByPostId = async (postId: number): Promise<ChatType | null> => {
  const res = await request.get(`/chats/posts/${postId}`);
  return res.data;
};

export const deleteChat = async (chatId: number, userId: number): Promise<void> => {
  await request.delete(`/chats/${chatId}/users/${userId}`);
};
