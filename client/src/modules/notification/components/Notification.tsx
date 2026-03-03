import { PopoverDescription } from "@/modules/shared/components/ui/Popover";
import type { NotificationType } from "@/modules/shared/types/types";
import { useSocket } from "@/modules/socket/context/SocketContext";
import { Check, X } from "lucide-react";
import { Separator } from "@/modules/shared/components/ui/Separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../api/notification";
import { useAuthStore } from "@/modules/auth/store/userStore";
import type { Dispatch, SetStateAction } from "react";
import { convertToDateString } from "@/modules/shared/lib";
import User from "@/modules/shared/components/User";

interface NotificationProps {
  notification: NotificationType;
  setPopupOpen: Dispatch<SetStateAction<boolean>>;
}

const Notification = ({ notification, setPopupOpen }: NotificationProps) => {
  const { socket } = useSocket();
  const token = useAuthStore().token;
  const queryClient = useQueryClient();

  const isJoinRequest = notification.type === "request";

  const mutation = useMutation({
    mutationFn: deleteNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
    },
  });

  const handleJoinRequest = async (response: string) => {
    socket.emit("joinResponse", {
      response,
      requestUserId: notification.fromUser?.id,
      postCreatorId: notification.user?.id,
      postId: notification.postId,
    });

    await mutation.mutateAsync(notification.id);
    setPopupOpen(false);
  };

  const handleRemoveResponseNotification = async () => {
    await mutation.mutateAsync(notification.id);
    setPopupOpen(false);
  };

  return (
    <div>
      <div className="flex-start my-2 gap-x-2">
        <User username={notification.fromUser.username} userId={notification.fromUser.id} className="" />
        <div className="flex flex-col">
          <PopoverDescription className="small-semibold">{notification.content}</PopoverDescription>
          <PopoverDescription className="text-xs text-gray-500">
            {convertToDateString(notification.created_at)}
          </PopoverDescription>
        </div>
        {isJoinRequest ? (
          <div className="flex-center ml-auto gap-x-1">
            <Check
              size={15}
              onClick={() => handleJoinRequest("approve")}
              className="cursor-pointer hover:text-gray-400"
            />
            <X size={15} onClick={() => handleJoinRequest("reject")} className="cursor-pointer hover:text-gray-400" />
          </div>
        ) : (
          <div className="flex-center ml-auto gap-x-1">
            <X size={15} onClick={handleRemoveResponseNotification} className="cursor-pointer hover:text-gray-400" />
          </div>
        )}
      </div>
      <Separator className="bg-gray-200" />
    </div>
  );
};

export default Notification;
