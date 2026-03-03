/* eslint-disable react-refresh/only-export-components */
import { useAuthStore } from "@/modules/auth/store/userStore";
import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket";
import type { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

interface SocketContextType {
  socket: Socket;
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

  useEffect(() => {
    if (!isAuthenticated || !token) {
      socket.disconnect();
      return;
    }

    socket.on("notification_join_request", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    });

    socket.on("notification_join_response", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    });

    socket.on("error", (data) => {
      console.log("Error from the socket: " + data);
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
