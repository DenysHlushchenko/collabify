import ChatItem from "./ChatItem";

const userChats = [
  {
    id: 1,
    title: "Chat Title 1",
  },
  {
    id: 2,
    title: "Chat Title 2",
  },
  {
    id: 3,
    title: "Chat Title 3",
  },
  {
    id: 4,
    title: "Chat Title 4",
  },
];

const UserChats = () => {
  return (
    <ul role="list" className="flex flex-col items-center space-y-4">
      {userChats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </ul>
  );
};

export default UserChats;
