import type { ChatType } from "@/modules/shared/types/types";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Error from "@/modules/shared/components/Error";
import DeleteDialog from "@/modules/shared/components/DeleteDialog";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useDeleteChatMutation } from "../hooks/useChat";
import AvatarGroup from "./AvatarGroup";
import User from "@/modules/shared/components/User";

interface ChatHeaderProps {
  chat: ChatType;
  isPending: boolean;
  error?: string;
}

const ChatHeader = ({ chat, isPending, error }: ChatHeaderProps) => {
  const membersLabel = chat.members.length > 1 ? "members" : "member";

  const currentUser = useAuthStore().getUser();
  const navigate = useNavigate();

  const mutation = useDeleteChatMutation(chat.id, currentUser!.id);

  const handleDelete = async () => {
    mutation.mutate();
    navigate("/chats");
  };

  return (
    <div className="mb-8 flex w-full items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link
          to="/chats"
          aria-label="Back to chats"
          className="block cursor-pointer text-sky-500 transition hover:text-sky-500 lg:hidden"
        >
          <ChevronLeft size={32} />
        </Link>
        {chat.members.length > 1 ? (
          <AvatarGroup users={chat.members} />
        ) : (
          <User
            userId={chat.members[0].user.id}
            username={chat.members[0].user.username}
            className="flex-center h-8 w-8 bg-[#D9D9D9] text-gray-500"
          />
        )}
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

      {chat.isOwner && <DeleteDialog handleDelete={handleDelete} />}
    </div>
  );
};

export default ChatHeader;
