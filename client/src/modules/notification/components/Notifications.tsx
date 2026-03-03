import { Button } from "@/modules/shared/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/modules/shared/components/ui/Popover";
import { BellIcon } from "lucide-react";
import { Separator } from "@/modules/shared/components/ui/Separator";
import { useQuery } from "@tanstack/react-query";
import { getAllNotificationsByUserId } from "../api/notification";
import Error from "@/modules/shared/components/Error";
import type { NotificationType } from "@/modules/shared/types/types";
import Notification from "./Notification";
import { useAuthStore } from "@/modules/auth/store/userStore";

const Notifications = () => {
  const currentUser = useAuthStore().getUser();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllNotificationsByUserId(currentUser!.id),
    staleTime: 3000 * 10,
    retry: 1,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative cursor-pointer" size="sm">
          <BellIcon />
          {data?.notificationCount ? (
            <span className="flex-center absolute -top-1 -right-2 z-10 h-5 w-5 rounded-full bg-[#F01C1C] px-1 text-xs">
              {data.notificationCount}
            </span>
          ) : (
            ""
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 border-none bg-white shadow-lg">
        <PopoverHeader>
          <PopoverTitle className="px-2 pt-3 pb-2">Pending Invitations</PopoverTitle>
          <Separator className="bg-gray-200" />
          {isPending && <p>Loading...</p>}
          {isError && <Error message={error.message} />}
        </PopoverHeader>
        <div className="px-2.5 pt-2 pb-3">
          {data?.notifications.length !== 0 ? (
            data?.notifications.map((notification: NotificationType) => (
              <Notification key={notification.id} notification={notification} />
            ))
          ) : (
            <p className="small-semibold">No notifications yet!</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
