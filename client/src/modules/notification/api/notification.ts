import { request } from "@/modules/shared/api/request";
import type { NotificationResponse } from "@/modules/shared/types/types";

export const getAllNotificationsByUserId = async (userId: number): Promise<NotificationResponse> => {
  const res = await request.get(`/notifications/users/${userId}`);
  const [notifications, count] = res.data;
  return {
    notifications,
    notificationCount: count,
  };
};
