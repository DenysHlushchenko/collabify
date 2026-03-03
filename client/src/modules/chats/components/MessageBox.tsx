import { useAuthStore } from "@/modules/auth/store/userStore";
import User from "@/modules/shared/components/User";
import { convertToDateString } from "@/modules/shared/lib";
import { cn } from "@/modules/shared/lib/utils";

interface MessageBoxProps {
  data: {
    id: number;
    content: string;
    sender: {
      id: number;
      username: string;
    };
    timestamp: Date;
  };
}

const MessageBox = ({ data }: MessageBoxProps) => {
  const user = useAuthStore().getUser();
  const isOwn = user?.id === data.sender.id;

  const container = cn("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = cn(isOwn && "order-2");
  const body = cn("flex flex-col gap-2", isOwn && "items-end");
  const message = cn("text-sm py-2 px-3 overflow-hidden rounded-lg", isOwn ? "bg-sky-500 text-white" : "bg-gray-100");

  return (
    <div className={container}>
      <div className={avatar}>
        <User userId={data.sender.id} username={data.sender.username} className="flex-center bg-[#D9D9D9] text-gray-500" />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.username}</div>
          <div className="text-xs text-gray-400">{convertToDateString(data.timestamp)}</div>
        </div>
        <div className={message}>
          <p>{data.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
