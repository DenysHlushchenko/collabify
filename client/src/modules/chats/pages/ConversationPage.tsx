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
  const { socket } = useSocket();
  const currentUser = useAuthStore().getUser();
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
    <div className="relative flex h-[calc(100vh-10rem)] flex-col md:h-[calc(100vh-6.5rem)]">
      {chat && <ChatHeader chat={chat} isPending={isPending} error={error?.message} />}
      <div className="no-scrollbar flex-1 overflow-y-auto pb-2">
        <Body userId={currentUser?.id} />
      </div>

      <div className="fixed right-0 bottom-0 z-40 w-full sm:w-[84%] md:relative md:w-full">
        <MessageForm />
      </div>
    </div>
  );
};

export default ConversationPage;
