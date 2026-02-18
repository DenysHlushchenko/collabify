import { decodeToken } from "@/modules/shared/lib";
import type { JwtPayload } from "@/modules/shared/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthenticated: () => boolean;
  getUser: () => { id: number; username: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,

      isAuthenticated: () => {
        const token = get().token;
        if (!token) return false;

        try {
          const decoded = decodeToken(token) as JwtPayload;
          if (!decoded) return false;

          const currentTime = Math.floor(Date.now() / 1000);
          return decoded.exp > currentTime;
        } catch (err) {
          console.error("Invalid token:", err);
          return false;
        }
      },

      getUser: () => {
        const token = get().token;
        if (!token) return null;

        try {
          const decoded = decodeToken(token) as JwtPayload;
          if (!decoded) return null;
          return { id: decoded.id, username: decoded.username };
        } catch {
          return null;
        }
      },

      login: (token: string) => set({ token }),

      logout: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
