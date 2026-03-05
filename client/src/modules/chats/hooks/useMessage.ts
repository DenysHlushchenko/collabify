import { useQuery } from "@tanstack/react-query";
import { getMessagesByChatId } from "../api/message";

export const useMessagesQuery = (chatId: number) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessagesByChatId(chatId),
    staleTime: 1000 * 10,
    retry: 2,
  });
};
