/* eslint-disable react-hooks/rules-of-hooks */
import { useAuthStore } from "@/modules/auth/store/userStore";
import ChatItem from "./ChatItem";
import { useChatsQuery } from "../hooks/useChat";
import Error from "@/modules/shared/components/Error";

const UserChats = () => {
  const currentUser = useAuthStore().getUser();
  if (!currentUser) return;

  const { data: chats, isPending, isError, error } = useChatsQuery(currentUser.id);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <Error message={error.message} />;

  return (
    <>
      <h3 className="h3-semibold text-center">Chats</h3>
      {chats?.length === 0 && <p className="text-center text-xs">No chats yet.</p>}
      <ul role="list" className="flex flex-col items-center space-y-4">
        {chats?.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </ul>
    </>
  );
};

export default UserChats;
