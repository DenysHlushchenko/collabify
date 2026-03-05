import { useEffect } from "react";
import Body from "../components/Body";
import ChatHeader from "../components/ChatHeader";
import MessageForm from "../forms/MessageForm";
import { useChatQuery } from "../hooks/useChat";
import { useParams } from "react-router-dom";
import { useSocket } from "@/modules/socket/context/SocketContext";

const ConversationPage = () => {
  const { chatId } = useParams();
  const { socket } = useSocket();
  const id = Number(chatId);
  const { data: chat, isPending, error } = useChatQuery(id);

  useEffect(() => {
    if (id) {
      socket.emit("joinChat", { chatId: id });
    }

    return () => {
      if (id) {
        socket.emit("leaveChat", { chatId: id });
      }
    };
  }, [id, socket]);

  return (
    <div className="flex h-[calc(100vh-6.5rem)] flex-col">
      {chat && <ChatHeader chat={chat} isPending={isPending} error={error?.message} />}
      <Body />
      <MessageForm />
    </div>
  );
};

export default ConversationPage;
