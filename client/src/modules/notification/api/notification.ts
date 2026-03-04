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

export const isPostJoinRequestForCurrentPostByUserId = async (userId: number, postId: number): Promise<boolean> => {
  const res = await request.get(`/notifications/posts/${postId}/users/${userId}`);
  return res.data;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await request.delete(`/notifications/${id}`);
};
