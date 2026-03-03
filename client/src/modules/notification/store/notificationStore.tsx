import type { NotificationType } from "@/modules/shared/types/types";
import { create } from "zustand";

interface NotificationState {
  notification: NotificationType | null;
  requestUserId: number;
  getNotification: () => void;
  setNotification: (notification: NotificationType) => void;
  getRequestUserId: () => void;
  setRequestUserId: (id: number) => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notification: null,
  requestUserId: -1,

  getNotification: () => {
    const notification = get().notification;
    return notification;
  },

  setNotification: (notification: NotificationType) => {
    set({ notification });
  },

  getRequestUserId: () => get().requestUserId,
  setRequestUserId: (id: number) => set({ requestUserId: id }),
}));
