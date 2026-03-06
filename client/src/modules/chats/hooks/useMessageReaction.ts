import { useSocket } from "@/modules/socket/context/SocketContext";
import { useCallback } from "react";

export const useMessageReaction = (chatId: number) => {
  const { socket } = useSocket();

  const react = useCallback(
    (messageId: number, reaction: string) => {
      socket.emit("reactToMessage", { messageId, chatId, reaction });
    },
    [chatId, socket]
  );

  return { react };
};
