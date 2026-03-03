import { PopoverDescription } from "@/modules/shared/components/ui/Popover";
import User from "@/modules/shared/components/User";
import type { NotificationType } from "@/modules/shared/types/types";
import { CircleCheck, CircleX } from "lucide-react";

interface NotificationProps {
  notification: NotificationType;
}

const Notification = ({ notification }: NotificationProps) => {
  return (
    <div className="flex-start my-2 gap-x-2">
      <User username={notification.user.username} className="" />
      <PopoverDescription className="small-semibold">{notification.content}</PopoverDescription>
      <div className="flex-end ml-auto flex gap-x-1">
        <CircleCheck className="cursor-pointer text-green-500" />
        <CircleX className="cursor-pointer text-red-500" />
      </div>
    </div>
  );
};

export default Notification;
