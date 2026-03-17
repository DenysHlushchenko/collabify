import { useEffect } from "react";
import Body from "../components/Body";
import ChatHeader from "../components/ChatHeader";
import MessageForm from "../forms/MessageForm";
import { useChatQuery } from "../hooks/useChat";
import { useParams } from "react-router-dom";
import { useSocket } from "@/modules/socket/context/SocketContext";
import { useAuthStore } from "@/modules/auth/store/userStore";

const ConversationPage = () => {
  const { chatId } = useParams();
  const currentUser = useAuthStore().getUser();

  const { socket } = useSocket();
  const id = Number(chatId);
  const { data: chat, isPending, error } = useChatQuery(id, currentUser!.id);

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
    <div className="relative flex h-[calc(100vh-10rem)] flex-col md:h-[calc(100vh-6.5rem)]">
      {chat && <ChatHeader chat={chat} isPending={isPending} error={error?.message} />}
      <div className="flex-1 overflow-y-auto pb-2">
        <Body />
      </div>
      <div className="fixed bottom-0 z-40 md:relative">
        <MessageForm />
      </div>
    </div>
  );
};

export default ConversationPage;
