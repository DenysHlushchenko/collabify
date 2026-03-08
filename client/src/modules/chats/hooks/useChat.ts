import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteChat, getAllChatsByUserId, getChatByUserId } from "../api/chat";
import { toast } from "sonner";
import type { FilterType } from "@/modules/shared/types/types";
import { useSearchParams } from "react-router-dom";

export const useChatsQuery = (userId?: number, edit?: boolean) => {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => (userId ? getAllChatsByUserId(userId) : null),
    enabled: !edit,
    staleTime: 1000 * 10,
    retry: 2,
  });
};

export const useChatQuery = (chatId: number, userId: number) => {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatByUserId(chatId, userId),
    staleTime: 1000 * 10,
    retry: 2,
  });
};

export const useDeleteChatMutation = (chatId: number, userId: number) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter") as FilterType;
  const search = searchParams.get("search");

  return useMutation({
    mutationFn: () => deleteChat(chatId, userId),

    onSuccess: async () => {
      toast.success("Post deleted successfully!", {
        position: "bottom-center",
        className: "toast-success font-inter",
      });

      await queryClient.invalidateQueries({ queryKey: ["chats", userId] });
      await queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      await queryClient.invalidateQueries({ queryKey: ["tags", "popular"] });
      await queryClient.invalidateQueries({ queryKey: ["posts", filter, search] });
    },

    onError: (error) => {
      console.error("Post delete failed: ", error);
    },
  });
};
