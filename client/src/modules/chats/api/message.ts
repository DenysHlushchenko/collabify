import { request } from "@/modules/shared/api/request";
import type { MessagesType } from "@/modules/shared/types/types";

export const getMessagesByChatId = async (chatId: number): Promise<MessagesType[]> => {
  const res = await request.get(`/messages/chats/${chatId}`);
  return res.data;
};

export const attachReactionToMessage = async (messageId: number, reaction: string): Promise<void> => {
  await request.put(`/messages/${messageId}/reactions`, { reaction });
};
