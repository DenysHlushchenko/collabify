import { useQuery } from "@tanstack/react-query";
import { getAllChatsByUserId, getChatById } from "../api/chat";

export const useChatsQuery = (userId?: number, edit?: boolean) => {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => (userId ? getAllChatsByUserId(userId) : null),
    enabled: !edit,
    staleTime: 1000 * 10,
    retry: 2,
  });
};

export const useChatQuery = (chatId: number) => {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
    staleTime: 1000 * 10,
    retry: 2,
  });
};
