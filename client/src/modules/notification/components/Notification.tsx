import { PopoverDescription } from "@/modules/shared/components/ui/Popover";
import type { NotificationType } from "@/modules/shared/types/types";
import { useSocket } from "@/modules/socket/context/SocketContext";
import { Check, X } from "lucide-react";
import { Separator } from "@/modules/shared/components/ui/Separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../api/notification";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { convertToDateString } from "@/modules/shared/lib";
import User from "@/modules/shared/components/User";
import { Button } from "@/modules/shared/components/ui/Button";

interface NotificationProps {
  notification: NotificationType;
}

const Notification = ({ notification }: NotificationProps) => {
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
  };

  const handleRemoveResponseNotification = async () => {
    await mutation.mutateAsync(notification.id);
  };

  return (
    <div className="relative pt-1.5">
      <div className="flex items-start gap-x-3">
        <User
          username={notification.fromUser.username}
          userId={notification.fromUser.id}
          className="h-8 w-8 shrink-0 bg-[#D9D9D9] font-bold text-gray-500"
        />

        <div className="flex flex-1 flex-col gap-2">
          <div className="space-y-0.5">
            <PopoverDescription className="small-semibold leading-snug">{notification.content}</PopoverDescription>
            <PopoverDescription className="text-xs text-gray-500">
              {convertToDateString(notification.created_at)}
            </PopoverDescription>
          </div>

          {isJoinRequest ? (
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                onClick={() => handleJoinRequest("approve")}
                aria-label="Approve join request"
                className="flex cursor-pointer items-center gap-1.5 rounded-md text-xs font-medium text-green-700 transition-colors hover:bg-green-600/20"
              >
                <Check size={16} />
                Approve
              </Button>

              <Button
                type="button"
                onClick={() => handleJoinRequest("reject")}
                aria-label="Reject join request"
                className="flex cursor-pointer items-center gap-1.5 rounded-md text-xs font-medium text-red-700 transition-colors hover:bg-red-600/20"
              >
                <X size={16} />
                Reject
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleRemoveResponseNotification}
              aria-label="Dismiss notification"
              className="absolute top-1.5 right-0 cursor-pointer p-1.5 text-gray-500 transition-colors hover:text-gray-800"
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>
      <Separator className="mt-3 bg-gray-200" />
    </div>
  );
};

export default Notification;
