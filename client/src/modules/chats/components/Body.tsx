import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { useMessagesQuery } from "../hooks/useMessage";
import { useParams } from "react-router-dom";
import { useSocket } from "@/modules/socket/context/SocketContext";

interface TypingUser {
  userId: number;
  username: string;
}

interface BodyProps {
  userId: number | undefined;
}

const Body = ({ userId }: BodyProps) => {
  const { chatId } = useParams();
  const { data: messages } = useMessagesQuery(Number(chatId));
  const bottomRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: TypingUser) => {
      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === data.userId)) {
          return prev;
        }
        return [...prev, data];
      });
    };

    const handleUserStoppedTyping = (data: { userId: number }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    socket.on("userIsTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("userIsTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket]);

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
    }
    return "Several people are typing...";
  };

  const isCurrentUserTyping = typingUsers.some((u) => u.userId === userId);

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto">
      {messages?.length ? (
        messages?.map((message) => {
          if (message.isChatJoinMessage) {
            return (
              <div key={message.id} className="flex-center my-2">
                <p className="text-sm text-gray-500">{message.message}</p>
              </div>
            );
          }
          return <MessageBox key={message.id} data={message} />;
        })
      ) : (
        <p className="pt-30 text-center">No messages yet!</p>
      )}
      {typingUsers.length > 0 && !isCurrentUserTyping && (
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <span className="text-sm text-gray-500">{getTypingText()}</span>
        </div>
      )}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
