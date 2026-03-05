import type { ChatType } from "@/modules/shared/types/types";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Error from "@/modules/shared/components/Error";

interface ChatHeaderProps {
  chat: ChatType;
  isPending: boolean;
  error?: string;
}

const ChatHeader = ({ chat, isPending, error }: ChatHeaderProps) => {
  const membersLabel = chat.members.length > 1 ? "members" : "member";

  return (
    <div className="mb-8 flex w-full items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link to="/chats" className="block cursor-pointer text-sky-500 transition hover:text-sky-500 lg:hidden">
          <ChevronLeft size={32} />
        </Link>
        <div className="flex flex-col">
          {isPending ? (
            <p>Loading chat title...</p>
          ) : (
            <>
              <div>{chat.title}</div>
              <div className="text-sm font-light text-neutral-500">
                {chat.members.length} {membersLabel}
              </div>
            </>
          )}
          {error && <Error message={error} />}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
