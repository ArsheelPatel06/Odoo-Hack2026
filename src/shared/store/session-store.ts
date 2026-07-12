"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockUser } from "@/shared/auth";
import { MOCK_USERS } from "@/shared/auth";

type SessionState = {
  user: MockUser | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      login: (email) => {
        const user = MOCK_USERS.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          return false;
        }

        set({
          user,
          token: user.token,
          isAuthenticated: true
        });

        return true;
      },
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: "transitops-session",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
