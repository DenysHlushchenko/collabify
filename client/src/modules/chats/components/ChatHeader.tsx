import type { ChatType } from "@/modules/shared/types/types";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Error from "@/modules/shared/components/Error";
import DeleteDialog from "@/modules/shared/components/dialogs/DeleteDialog";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useDeleteChatMutation } from "../hooks/useChat";
import AvatarGroup from "./AvatarGroup";
import User from "@/modules/shared/components/User";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/shared/components/ui/Popover";

interface ChatHeaderProps {
  chat: ChatType;
  isPending: boolean;
  error?: string;
}

const ChatHeader = ({ chat, isPending, error }: ChatHeaderProps) => {
  const membersLabel = chat.members.length > 1 ? "members" : "member";

  const currentUser = useAuthStore().getUser();
  const navigate = useNavigate();

  const [popupOpen, setPopupOpen] = useState<boolean>(false);

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
              <div className="text-sm font-light text-neutral-500" onClick={() => setPopupOpen(true)}>
                {chat.members.length} {membersLabel}
              </div>
            </>
          )}
          {error && <Error message={error} />}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Popover open={popupOpen} onOpenChange={setPopupOpen}>
          <PopoverTrigger asChild>
            <button className="cursor-pointer text-sm text-sky-500 hover:text-sky-300">View members</button>
          </PopoverTrigger>
          <PopoverContent className="w-48 rounded-md border-0 bg-white shadow-lg">
            <p className="body-medium bg-gray-50 p-2">Chat members</p>
            <ul className="p-2">
              {chat.members.map((member) => (
                <li key={member.user.id} className="flex-start gap-x-2 rounded-md p-1 transition hover:bg-gray-100">
                  <User
                    userId={member.user.id}
                    username={member.user.username}
                    className={"flex-center small-medium size-full h-6 w-6 bg-[#D9D9D9] text-gray-500"}
                  />
                  <p className="text-xs text-gray-500">{member.user.username}</p>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        {chat.isOwner && <DeleteDialog handleDelete={handleDelete} />}
      </div>
    </div>
  );
};

export default ChatHeader;
