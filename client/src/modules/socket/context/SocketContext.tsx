/* eslint-disable react-refresh/only-export-components */
import { useAuthStore } from "@/modules/auth/store/userStore";
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import type { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SocketContextType {
  socket: Socket;
  activeUsersIds: number[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore().getUser();
  const queryClient = useQueryClient();

  const [activeUsersIds, setActiveUsersIds] = useState<number[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socket.disconnect();
      return;
    }

    socket.on("activeUsers", (usersIds: number[]) => {
      setActiveUsersIds(usersIds);
    });

    // post creator receives the join request
    socket.on("notification_join_request", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    });

    socket.on("join_request_created", (data) => {
      queryClient.invalidateQueries({ queryKey: ["notification-status", token, data.postId] });
    });

    socket.on("member_joined_chat", (data: { chatId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", data.chatId] });
    });

    // request join user receives the join response
    socket.on("notification_join_response", (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
      queryClient.invalidateQueries({ queryKey: ["notification-status", token, data.notification.postId] });
      queryClient.invalidateQueries({ queryKey: ["chat-by-post", data.notification.postId] });
    });

    /**
     * Socket chat message responses from the server
     */
    socket.on("receiveMessage", (data) => {
      const chatId = data.savedMessage.chat.id;
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats", currentUser?.id] });
    });

    // when a message reaction is added, the server emits an event to update the message reactions for all clients in the chat
    socket.on("messageReactionUpdated", (data: { chatId: number }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", data.chatId] });
    });

    /**
     * Socket errors from the server
     */
    socket.on("error", (error) => {
      console.log("Error from the socket: " + error);
    });

    // if request user presses the "join" button twice, it receives an error
    socket.on("requestDuplicateError", (error) => {
      toast(error);
    });

    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${token}`,
    };

    socket.connect();

    return () => {
      socket.off("notification_join_request");
      socket.off("notification_join_response");
      socket.off("join_request_created");
      socket.off("receiveMessage");
      socket.off("messageReactionUpdated");
      socket.off("error");
      socket.off("requestDuplicateError");
      socket.disconnect();
    };
  }, [currentUser?.id, isAuthenticated, queryClient, token]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeUsersIds,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
