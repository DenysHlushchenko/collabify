import { adjustText } from "@/modules/shared/lib";
import { cn } from "@/modules/shared/lib/utils";
import { Link, useParams } from "react-router-dom";

interface ChatItemProps {
  chat: {
    id: number;
    title: string;
  };
}

const ChatItem = ({ chat }: ChatItemProps) => {
  const { chatId } = useParams();
  const isActive = chat.id === Number(chatId);

  const chatTitle = adjustText(chat.title, 20);

  return (
    <Link
      to={`/chats/${chat.id}`}
      className={cn(
        "body-regular flex w-full cursor-pointer items-center justify-center px-4 py-2 hover:rounded-lg hover:bg-[#e8edf3]",
        isActive && "rounded-lg bg-[#e8edf3] font-semibold"
      )}
    >
      {chatTitle}
    </Link>
  );
};

export default ChatItem;
