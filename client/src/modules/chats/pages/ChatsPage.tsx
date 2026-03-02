import UserChats from "../components/UserChats";

const ChatsPage = () => {
  return (
    <>
      <div className="pt-36 md:hidden">
        <UserChats />
      </div>

      <div className="hidden md:flex md:h-96 md:items-center md:justify-center">
        <p className="text-gray-600">Select a conversation to start messaging</p>
      </div>
    </>
  );
};

export default ChatsPage;
