/* eslint-disable react-refresh/only-export-components */
import { useAuthStore } from "@/modules/auth/store/userStore";
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SocketContextType {
  socket: Socket;
  isConnected: boolean;
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
  const queryClient = useQueryClient();

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socket.disconnect();
      return;
    }

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("userConnected", (message) => {
      console.log(message);
    });

    socket.on("notification_join_request", (data) => {
      toast.success(data.notification.content, {
        position: "top-right",
        className: "toast-success font-inter",
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    socket.io.opts.extraHeaders = {
      Authorization: `Bearer ${token}`,
    };

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [isAuthenticated, queryClient, token]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
