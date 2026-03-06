import { Button } from "@/modules/shared/components/ui/Button";
import { Input } from "@/modules/shared/components/ui/Input";
import { useSocket } from "@/modules/socket/context/SocketContext";
import { SendHorizontal } from "lucide-react";
import { useRef } from "react";
import { useParams } from "react-router-dom";

const MessageForm = () => {
  const { chatId } = useParams();
  const id = Number(chatId);
  const { socket } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);

  const sentMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("sendMessage", {
      message: inputRef.current?.value,
      chatId: id,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex w-full items-center gap-2 bg-white p-4 lg:gap-4">
      <form onSubmit={sentMessage} className="flex w-full items-center gap-2 lg:gap-4">
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="text"
            required
            aria-label="Message input"
            placeholder="Write a message"
            className="w-full rounded-full border-none bg-neutral-100 px-4 py-2 font-light text-black"
          />
        </div>
        <Button
          type="submit"
          aria-label="Send message"
          className="cursor-pointer rounded-full bg-sky-500 transition hover:bg-sky-600"
        >
          <SendHorizontal size={18} className="text-white" />
        </Button>
      </form>
    </div>
  );
};

export default MessageForm;
