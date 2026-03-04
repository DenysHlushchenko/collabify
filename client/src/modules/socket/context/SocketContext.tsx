/* eslint-disable react-refresh/only-export-components */
import { useAuthStore } from "@/modules/auth/store/userStore";
import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket";
import type { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

    /**
     * Socket responses from the server
     */
    socket.on("notification_join_request", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    });

    socket.on("notification_join_response", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
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
      socket.off("error");
      socket.off("requestDuplicateError");
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
