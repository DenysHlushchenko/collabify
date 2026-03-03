import { useRef } from "react";
import MessageBox from "./MessageBox";

const messages = [
  {
    id: 2,
    content: "Hello, how are you?",
    sender: {
      id: 1,
      username: "Alice",
    },
    timestamp: new Date(),
  },
  {
    id: 3,
    content: "I'm good, thanks! How about you?",
    sender: {
      id: 14,
      username: "Denys",
    },
    timestamp: new Date(),
  },
  {
    id: 4,
    content: "Doing well, just working on a project.",
    sender: {
      id: 1,
      username: "Alice",
    },
    timestamp: new Date(),
  },
];

const Body = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message) => (
        <MessageBox key={message.id} data={message} />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
