import Body from "../components/Body";
import Header from "../components/Header";
import MessageForm from "../forms/MessageForm";

const ConversationPage = () => {
  return (
    <div className="flex h-[calc(100vh-6.5rem)] flex-col">
      <Header />
      <Body />
      <MessageForm />
    </div>
  );
};

export default ConversationPage;
