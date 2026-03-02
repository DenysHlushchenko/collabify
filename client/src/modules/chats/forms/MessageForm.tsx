import { Button } from "@/modules/shared/components/ui/Button";
import { Input } from "@/modules/shared/components/ui/Input";
import { SendHorizonal } from "lucide-react";

const MessageForm = () => {
  return (
    <div className="flex w-full items-center gap-2 bg-white p-4 lg:gap-4">
      <form className="flex w-full items-center gap-2 lg:gap-4">
        <div className="relative w-full">
          <Input
            type="text"
            required
            placeholder="Write a message"
            className="rounded-ful w-full border-none bg-neutral-100 px-4 py-2 font-light text-black"
          />
        </div>
        <Button type="submit" className="cursor-pointer rounded-full bg-sky-500 transition hover:bg-sky-600">
          <SendHorizonal size={18} className="text-white" />
        </Button>
      </form>
    </div>
  );
};

export default MessageForm;
