import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteChat, getAllChatsByUserId, getChatById } from "../api/chat";
import { toast } from "sonner";

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

export const useDeleteChatMutation = (chatId: number, userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteChat(chatId, userId),

    onSuccess: async () => {
      toast.success("Post deleted successfully!", {
        position: "bottom-center",
        className: "toast-success font-inter",
      });

      await queryClient.invalidateQueries({ queryKey: ["chats", userId] });
      await queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    },

    onError: (error) => {
      console.error("Post delete failed: ", error);
    },
  });
};
