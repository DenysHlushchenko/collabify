import { Button } from "@/modules/shared/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/modules/shared/components/ui/Popover";
import { BellIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllNotificationsByUserId } from "../api/notification";
import Error from "@/modules/shared/components/Error";
import type { NotificationType } from "@/modules/shared/types/types";
import Notification from "./Notification";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { Skeleton } from "@/modules/shared/components/ui/Skeleton";
import { useState } from "react";

const Notifications = () => {
  const currentUser = useAuthStore().getUser();
  const token = useAuthStore().token;

  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["notifications", token],
    queryFn: () => getAllNotificationsByUserId(currentUser!.id),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 3000 * 10,
    retry: 1,
  });

  return (
    <Popover open={popupOpen} onOpenChange={setPopupOpen}>
      <PopoverTrigger asChild>
        <Button className="relative cursor-pointer" size="sm">
          {data?.notificationCount ? (
            <>
              <BellIcon className="fill-white" />
              <span className="flex-center absolute -top-1 -right-2 z-10 h-5 w-5 rounded-full bg-[#F01C1C] px-1 text-xs">
                {data.notificationCount}
              </span>
            </>
          ) : (
            <BellIcon />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 rounded-md border-none bg-white shadow-lg">
        <PopoverHeader>
          <PopoverTitle className="rounded-t-md bg-gray-100 px-3 pt-3 pb-2">Pending Invitations</PopoverTitle>
          {isPending && <Skeleton className="h-full w-full" />}
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
