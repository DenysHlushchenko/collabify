/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";

type JoinRequestStatus = "pending" | "closed";

interface NotificationState {
  pendingJoinRequests: Record<number, JoinRequestStatus>;
  addPendingJoin: (postId: number) => void;
  removeJoinRequest: (postId: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  pendingJoinRequests: {},

  addPendingJoin: (postId) =>
    set((state) => ({
      pendingJoinRequests: {
        ...state.pendingJoinRequests,
        [postId]: "pending",
      },
    })),

  removeJoinRequest: (postId) =>
    set((state) => {
      const { [postId]: _, ...rest } = state.pendingJoinRequests;
      return { pendingJoinRequests: rest };
    }),
}));
