import { useQuery } from "@tanstack/react-query";
import { getAllChatsByUserId } from "@/modules/chats/api/chat";

export const usePostChats = (userId?: number) => {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => (userId ? getAllChatsByUserId(userId) : null),
    enabled: !!userId,
    staleTime: 1000 * 10,
    retry: 2,
  });
};
