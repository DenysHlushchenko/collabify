import { useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import { useMessagesQuery } from "../hooks/useMessage";
import { useParams } from "react-router-dom";

const Body = () => {
  const { chatId } = useParams();
  const { data: messages } = useMessagesQuery(Number(chatId));
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto">
      {messages?.length ? (
        messages?.map((message) => <MessageBox key={message.id} data={message} />)
      ) : (
        <p className="flex-center h-full">No messages yet!</p>
      )}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
